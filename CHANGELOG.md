### 0.3.0 (2022-01-05)

Modified `CompositeFieldsAreNullable` to accept a `rulesOptions` list of exceptions.
It no longer assumes that the schema follows Relays' spec, so PageInfo was removed from the default behaviour of the rule and must be added as an exception if needed.

### 0.2.0 (2020-12-23)

Added `NodesContainEntityId` rule.

#### 0.1.0 (2020-12-21)

Initial release with `CompositeFieldsAreNullable` rule.
