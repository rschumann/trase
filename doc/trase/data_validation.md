# Data validation process

In order to help with correct configuration of the tool (the configuration is the metadata stored in the "yellow tables"), we have a validation tool which inspect the entire system, especially at the cross-section of "blue" and "yellow" tables, and creates a report with all anomalies it detected. That can be used to amend the configuration using the admin tool.

The output of the validation tool, which can be downloaded from the admin interface, is currently a pretty-formatted json, a collection of error objects. This is what a sample error looks like:

```
  {
    "table": "contexts",
    "id": 4,
    "type": "Api::V3::DatabaseValidation::Checks::HasAtLeastOne",
    "link": "/content/admin/map_attributes",
    "severity": "error",
    "message": "At least one map_attribute should be present"
  },
```
It means that while checking context with id=4 it detected there are no map attributes defined for it. It gives the link to the admin tool where it can be fixed.

There are two severity levels, `error` and `warn`, to indicate where we think we've encountered a misconfiguration which has a potential of breaking things vs a potentially missing optional configuration.

This is another type of error, which is a wrapper over existing Active Record validations in models:

```
  {
    "table": "context_properties",
    "id": 50,
    "type": "Api::V3::DatabaseValidation::Checks::ActiveRecordCheck",
    "link": "/content/admin/context_properties/50/edit",
    "severity": "error",
    "message": "Default basemap is not included in the list"
  },
```

There are two ways to add a new validation:
- if it is a validation that relates to a single "yellow" table, best to add it to the Active Record model and it should be picked up automatically
- if it is a validation that involves more than one table, it is likely that adding it to the model will make the admin tool unusable or difficult to use with update operations being blocked without the means to resolve the blocker. E.g. if we want to validate that a `contextual_layer` has at least one `carto_layer`, we'd need to change the admin tool so that it's possible to create / update both types of object at same time, otherwise it becomes impossible to add a `contextual_layer`. In such cases, as well as in case of validations that run with `warn` severity, add a custom one.

The custom validators are defined in app/services/api/v3/database_validation. This is the contents of this directory:

```
.
├── chain_builders
│   ├── abstract_chain_builder.rb
│   ├── context_chain_builder.rb
│   ├── context_node_type_chain_builder.rb
│   ├── contextual_layer_chain_builder.rb
│   ├── country_chain_builder.rb
│   ├── download_attribute_chain_builder.rb
│   ├── ind_chain_builder.rb
│   ├── map_attribute_chain_builder.rb
│   ├── qual_chain_builder.rb
│   ├── quant_chain_builder.rb
│   ├── recolor_by_attribute_chain_builder.rb
│   └── resize_by_attribute_chain_builder.rb
├── checks
│   ├── abstract_check.rb
│   ├── active_record_check.rb
│   ├── attribute_present.rb
│   ├── declared_temporal_matches_data.rb
│   ├── declared_years_match_data.rb
│   ├── has_at_least_one.rb
│   ├── has_at_least_one_profile.rb
│   ├── has_exactly_one.rb
│   ├── has_exactly_one_of.rb
│   └── required_node_types_present.rb
├── errors_list.rb
└── report.rb
```

In case of the custom validations, the core class is the `Api::V3::DatabaseValidation::Report`, which builds a "chain" of checks to be run, then runs them by calling `passing?` on each of them and constructs the list of errors, which gets saved in the database. Chain builders are used to construct parts of the chain relevant to a particular resource.
