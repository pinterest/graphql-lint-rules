# Pinterest GraphQL Lint Rules

This is a set of zero-dependency rules to be used with the [`graphql-schema-linter`](https://github.com/cjoudrey/graphql-schema-linter) package.

These rules are based on schema conventions we have established at Pinterest.

## Installation

#### Install this package somewhere that `graphql-schema-linter` can access it.

For instance, to package with your project, run:

```
npm install -D @pinterest/graphql-lint-rules
```

Or, if you want to use these rules locally across multiple projects, run:
```
yarn global add @pinterest/graphql-lint-rules
```

#### Add the following to your [configuration file for `graphql-schema-linter`](https://github.com/cjoudrey/graphql-schema-linter#configuration-file):

```json5
// The exact format here depends on what configuration format (JSON or JavaScript) you use
"customRulePaths": ["/path/to/npm_modules/@pinterest/graphql-lint-rules/rules/*.js"]
```

If you prefer, pass `--custom-rule-paths '/path/to/npm_modules/@pinterest/graphql-lint-rules/rules/*.js'` to `graphql-schema-linter` instead.

#### Finally, add the names of the rules you want to lint to the `rules` array of your config (or `--rules` flag)

For example:

```json
"rules": [
  "composite-fields-are-nullable"
]
```

## Lint Rules

### `composite-fields-are-nullable`

When a field has a composite GraphQL type (object, interface, union), it must not be declared as a non-null field.

#### Rationale

Composite fields are more often tied to a resolver that needs to fetch some additional data than are scalar fields. Any failure that results from that data fetch will cause a `null` value to bubble up the query tree unless the field is marked as nullable.

While it is possible to change a nullable field to non-null in schema updates, the reverse is a breaking change. The "safe" default behavior is to have these fields be nullable.

Caleb Meredith has written a [good summary of issues around nullability](https://calebmer.com/2017/08/25/when-to-use-graphql-non-null-fields.html).

#### Exceptions

The `pageInfo` field [is specified by the Relay cursor connections specification as a non-null field](https://relay.dev/graphql/connections.htm#sec-Connection-Types.Fields.PageInfo), and therefore violates this rule. Since it's more important to follow the spec than this rule, fields that use the `PageInfo` type are skipped.

As many schemas will have a nonzero number of exceptions to this rule, fields can be marked with an `@allowNonNull` decorator (which you must add to your schema) to skip this rule as well. Standard [`graphql-schema-linter` overrides](https://github.com/cjoudrey/graphql-schema-linter#inline-rule-overrides) will work as well.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md).