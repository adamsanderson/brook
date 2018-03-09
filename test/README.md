# Testing Guidelines

Tests are written using [Jest](https://github.com/facebook/jest) and [Enzyme](https://github.com/airbnb/enzyme).

Currently Brook is developed in my spare time.  This means time is a limited resource, and testing needs to be focused on the places it provides the most value.

## Testing Priorities

1. Test functionality that is laborious to verify manually.
2. Test external inputs, ie: OPML files, feed contents, etc.
3. Test features that are not core interactions, and are likely to be missed.
4. Test known bugs to verify regressions have been fixed.

## Testing Non-Priorities

Total test coverage is not a goal, nor desirable.  Write tests where they will provide value.  If tests hinder further development, then they probably either need to test at a higher level.