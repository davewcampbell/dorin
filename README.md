dorin
=====

File management system written in Node.js.

The goal of the project is to perform actions on file systems in bulk.  The currently supported actions are:

* Copy
* Move
* Purge (Delete)
* Post (Http)

### prairiedog

The prairiedog task holds the log to crawl a single path specified with a list of options and perform one of the actions above to each file matching the criteria.


#### Purge

* Source
* Options

#### Move

* Source
* Destination
* Options

#### Copy
* Source
* Destinations
* Options

#### Post
* Source
* Destinations
* Options


### options
* extensions
* recursive
* preserveDirectoryStructure
* logIgnoredItems
* limit

#### extensions

An array of strings that indicate which are the target extensions. Leave it null or empty to indicate all extensions.

Example 

`options.extensions = ['.txt', '.xml'];`

#### recursive

A boolean value to indicate if subfolders found in the root of Source should be processed as well. Default is false.

Example

`options.recursive = true;`

#### preserveDirectoryStructure

A boolean value to indicate if the current directory structure should be preserved. Only applies to Move and Copy. 

If the source value for copy is `/source` and we are in `level1/`, preserving the directory strucutre would cause the file to be copied to `/destination/level1/`. Otherwise, the file would be moved to `/destination` only.

#### logIgnoredItems

A boolean value to indicate if items that are not processed should be logged or not. Default is false as it will add a lot of data to the log files. But it is useful for auditing to know that a file was found in the folder at run time, but was not processed as it didn't meet the criteria set forth in the options.

Example

`options.logIgnoredItems = false;`

#### limit

An object used to indicate the date time value for evaluation against the last modified of each file found.

* value
* interval
* compareAs

value - an integer value to use as the target number.

interval - string value to act as the weight of the value, must be one of the following:

* seconds
* minutes
* hours
* days

compareAs - a string value indicate how to compare the interval and value. Must be one of the following:

* before
* after

Examples

`options.limit = {value: 2, 	interval: 'minutes', 	compareAs: 'before'};`

This limit value will target any file whose last modified value is older than 2 minutes from the time of checking. Only files newer than 2 minutes will remain.

`options.limit = {value: 7, 	interval: 'days', 	compareAs: 'after'};`

This limit value will target any file whose last modified value is newer than 7 days. Only files who are older than 7 days will remain.



