using System.Reflection;

namespace AyuPos.Web.Application.Common.Extensions;

public static class MappingExtension
{
    // Cache for property mappings to improve performance
    private static readonly Dictionary<(Type, Type), PropertyMapping[]> PropertyMappingCache = new();

    #region MatchTo Methods

    /// <summary>
    /// Maps properties from source object to a new instance of TOut
    /// </summary>
    public static TOut MatchTo<TIn, TOut>(this TIn? source)
        where TIn : class
        where TOut : class, new()
    {
        var target = new TOut();

        if (source == null)
            return target;

        CopyProperties(source, target);
        return target;
    }

    /// <summary>
    /// Maps properties from source object to a new instance of the specified type
    /// </summary>
    public static TOut MatchTo<TOut>(this object? source, Type targetType)
        where TOut : class
    {
        if (!typeof(TOut).IsAssignableFrom(targetType))
            throw new ArgumentException($"Type {targetType.FullName} is not assignable to {typeof(TOut).FullName}");

        var target = Activator.CreateInstance(targetType) as TOut
                     ?? throw new InvalidOperationException($"Failed to create instance of type {targetType.FullName}");

        if (source == null)
            return target;

        CopyProperties(source, target);
        return target;
    }

    /// <summary>
    /// Maps properties from source object to an existing target object
    /// </summary>
    public static TOut MatchTo<TIn, TOut>(this TIn? source, TOut target)
        where TIn : class
        where TOut : class
    {
        if (source == null || target == null)
            return target;

        CopyProperties(source, target);
        return target;
    }

    #endregion

    #region MatchFrom Methods

    /// <summary>
    /// Maps properties from source object to this target object
    /// </summary>
    public static TTarget MatchFrom<TTarget, TSource>(this TTarget target, TSource? source)
        where TTarget : class
        where TSource : class
    {
        if (target == null)
            throw new ArgumentNullException(nameof(target));

        if (source == null)
            return target;

        CopyProperties(source, target);
        return target;
    }

    /// <summary>
    /// Maps properties from source object to this target object with type checking
    /// </summary>
    public static TTarget MatchFrom<TTarget>(this TTarget target, object? source, Type sourceType)
        where TTarget : class
    {
        if (target == null)
            throw new ArgumentNullException(nameof(target));

        if (source == null)
            return target;

        if (!sourceType.IsInstanceOfType(source))
            throw new ArgumentException($"Source object is not of type {sourceType.FullName}");

        CopyProperties(source, target);
        return target;
    }

    #endregion

    #region Collection Extensions

    /// <summary>
    /// Maps a collection of source objects to a new collection of target objects
    /// </summary>
    public static IEnumerable<TOut> MatchToMany<TIn, TOut>(this IEnumerable<TIn>? source)
        where TIn : class
        where TOut : class, new()
    {
        if (source == null)
            yield break;

        foreach (var item in source)
        {
            yield return item.MatchTo<TIn, TOut>();
        }
    }

    /// <summary>
    /// Maps a collection of source objects to a list of target objects
    /// </summary>
    public static List<TOut> MatchToList<TIn, TOut>(this IEnumerable<TIn>? source)
        where TIn : class
        where TOut : class, new()
    {
        return source?.MatchToMany<TIn, TOut>().ToList() ?? new List<TOut>();
    }

    #endregion

    #region Helper Methods

    private static void CopyProperties(object source, object target)
    {
        var sourceType = source.GetType();
        var targetType = target.GetType();
        var mappings = GetPropertyMappings(sourceType, targetType);

        foreach (var mapping in mappings)
        {
            try
            {
                var value = mapping.SourceProperty.GetValue(source);

                // Handle type conversions for common scenarios
                if (value != null && mapping.SourceProperty.PropertyType != mapping.TargetProperty.PropertyType)
                {
                    // Handle nullable types
                    var targetPropertyType = Nullable.GetUnderlyingType(mapping.TargetProperty.PropertyType)
                                             ?? mapping.TargetProperty.PropertyType;

                    if (value.GetType() != targetPropertyType)
                    {
                        // Try to convert the value
                        if (targetPropertyType.IsEnum && value is string stringValue)
                        {
                            value = Enum.Parse(targetPropertyType, stringValue, true);
                        }
                        else if (targetPropertyType == typeof(string))
                        {
                            value = value.ToString();
                        }
                        else
                        {
                            value = Convert.ChangeType(value, targetPropertyType);
                        }
                    }
                }

                mapping.TargetProperty.SetValue(target, value);
            }
            catch (Exception ex)
            {
                // Log the error but continue mapping other properties
                // In production, you might want to use a proper logging framework
                Console.WriteLine($"Error mapping property {mapping.SourceProperty.Name}: {ex.Message}");
            }
        }
    }

    private static PropertyMapping[] GetPropertyMappings(Type sourceType, Type targetType)
    {
        var key = (sourceType, targetType);

        if (PropertyMappingCache.TryGetValue(key, out var cachedMappings))
            return cachedMappings;

        var sourcePropDict = sourceType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .Where(p => p.CanRead)
            .ToDictionary(p => p.Name, StringComparer.OrdinalIgnoreCase);

        var mappings = targetType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .Where(targetProp => targetProp.CanWrite)
            .Select(targetProp =>
            {
                if (sourcePropDict.TryGetValue(targetProp.Name, out var sourceProp))
                {
                    return new PropertyMapping(sourceProp, targetProp);
                }

                return null;
            })
            .Where(m => m != null)
            .ToArray();

        PropertyMappingCache[key] = mappings!;
        return mappings!;
    }

    private class PropertyMapping
    {
        public PropertyInfo SourceProperty { get; }
        public PropertyInfo TargetProperty { get; }

        public PropertyMapping(PropertyInfo sourceProperty, PropertyInfo targetProperty)
        {
            SourceProperty = sourceProperty;
            TargetProperty = targetProperty;
        }
    }

    #endregion

    #region Advanced Mapping Options

    /// <summary>
    /// Maps properties with custom configuration
    /// </summary>
    public static TOut MatchTo<TIn, TOut>(this TIn? source, Action<MappingConfiguration<TIn, TOut>> configure)
        where TIn : class
        where TOut : class, new()
    {
        var target = new TOut();
        if (source == null) return target;

        var config = new MappingConfiguration<TIn, TOut>(source, target);
        configure(config);
        config.Execute();

        return target;
    }

    public class MappingConfiguration<TSource, TTarget>
        where TSource : class
        where TTarget : class
    {
        private readonly TSource _source;
        private readonly TTarget _target;
        private readonly List<Action> _mappingActions = new();
        private readonly HashSet<string> _ignoredProperties = new();

        internal MappingConfiguration(TSource source, TTarget target)
        {
            _source = source;
            _target = target;
        }

        public MappingConfiguration<TSource, TTarget> Ignore(string propertyName)
        {
            _ignoredProperties.Add(propertyName);
            return this;
        }

        public MappingConfiguration<TSource, TTarget> Map<TValue>(
            string targetPropertyName,
            Func<TSource, TValue> sourceExpression)
        {
            _mappingActions.Add(() =>
            {
                var targetProp = typeof(TTarget).GetProperty(targetPropertyName);
                if (targetProp != null && targetProp.CanWrite)
                {
                    var value = sourceExpression(_source);
                    targetProp.SetValue(_target, value);
                }
            });
            return this;
        }

        internal void Execute()
        {
            // First, copy all properties except ignored ones
            var sourceType = typeof(TSource);
            var targetType = typeof(TTarget);

            foreach (var targetProp in targetType.GetProperties())
            {
                if (_ignoredProperties.Contains(targetProp.Name) || !targetProp.CanWrite)
                    continue;

                var sourceProp = sourceType.GetProperty(targetProp.Name);
                if (sourceProp != null && sourceProp.CanRead)
                {
                    var value = sourceProp.GetValue(_source);
                    targetProp.SetValue(_target, value);
                }
            }

            // Then, execute custom mappings
            foreach (var action in _mappingActions)
            {
                action();
            }
        }
    }

    #endregion
}