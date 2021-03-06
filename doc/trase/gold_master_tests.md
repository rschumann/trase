# Gold master tests

The technique consists in comparing the system's outputs against a known correct "gold master" obtained using the same input parameters.

## Recording gold masters

The script will connect to the API at GOLD_MASTER_HOST_V3, which at the time should be running the known correct version of code we want to compare against.

`bundle exec rake gold_master:record`

It records the gold master responses for all the urls and zips them in `spec/support/gold_master.zip`.

Note: it should be re-run also when `spec/support/gold_master_urls.yml` is updated.

Note: some responses are huge, over 1 MB.

## Testing against gold masters

The script will connect to the API at GOLD_MASTER_HOST_V3, which at the time should be running the changed code we want to test, using the same database as when the gold masters were recorded.

`bundle exec rake gold_master:test`

It collects responses and compares with the gold master using json & csv diffing tools.

Note: the responses are stored uncompressed in `tmp/actual` and are not cleaned after the tests have run.
