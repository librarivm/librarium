### Jul 5, 2024

**DONE**:

- Worked on fixing the Mock model to use sinon.createSandbox. Then stub the methods as needed.
- updated unit and functional test files to reflect the changes.
- Cleaned up the mock_model.ts file to have an actual Lucid model for testing purposes (no migration though; maybe in  
  future the need to add one will arise).

**TO DO**:

- Move Journal.md to Obsidian
- Journal.md Then set up a backup system there.
- Add authentication via access_token
- Continue developing the tests for `libraries.store`
- Add validation and its tests; revisit any potential test breakages

## Jul 6, 2024

**DONE:**

* Move Journal.md to Obsidian
* Added UserService with authentication methods and their unit tests
* Added initial functional tests for registering a user
* Add authentication via access_token
* Add feature: `auth.register` functional test and its failed scenarios

**TO DO:**

* Continue working on with the login feature and its unit + functional tests

- Journal.md Then set up a backup system there.
- Continue developing the tests for `libraries.store`
- Add validation and its tests for library; revisit any potential test breakages

## Jul 7, 2024

**DONE**:

* Added login feature and its unit + functional tests
* Added logout feature and its functional test
* Refactored some types for registration classes
* Added auth.me feature and its functional tests
* Decided to just add the Journal.md in the project itself; is the best way to back up, and easy access

**TO DO**:

* Journal.md: set up a backup system
* Add auth middleware route for libraries
  * revisit any potential test breakages
* Continue developing the tests for `libraries.store`
