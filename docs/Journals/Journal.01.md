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
* Added `auth.me` feature and its functional tests
* Decided to just add the Journal.md in the project itself; is the best way to back up, and easy access
* Added auth middleware to libraries routes
* Added validation functional test to `libraries.store`
* Added `libraries.update` feature and its functional tests
* Added `libraries.archive` feature and its functional tests

**TO DO**:

* Add `libraries.delete` feature and its functional tests
* Fix ts type issues
* Integrate RBAC and Authorizations (roles, permissions)
* Create README.md
* Setup initial `librarivm/ui` repository.
  * Decided to have the front-end to a separate repository.
  * They'd just be deployed and set up from one installer.

## Jul, 8 2024

**DONE**:

* Added validating of slug uniqueness for `librarues.{store,update}`
* Added `libraries.delete` feature and its functional tests
* Fixed ts type issues
* Added permissions feature with installation method and its unit tests
* Added role service and its unit tests
* Added `roles.index` endpoint and its functional tests
* Added `roles.show` endpoint and its functional tests
  * Added `roles.users` and `roles.permissions` relations
* Added `roles.store` endpoint and its functional tests
* Added `roles.update` endpoint and its functional tests
* Added `roles.archive` endpoint and its functional tests
* Added `roles.destroy` endpoint and its functional tests

**TO DO**:

* Integrate RBAC and Authorizations (roles, permissions)
  * revisit `*.{list,store,show}` if `role.permissions` is allowed for the route.
  * revisit `*.{update,archive,destroy}` as `auth.id` in `users.each.id`
* Create README.md
* Setup initial `librarivm/ui` repository.
  * Decided to have the front-end to a separate repository.
  * They'd just be deployed and set up from one installer.
* Add plugins support?

## Jul 9, 2024

**DONE**:

* Refactored services interfaces to be types
* Added unit tests for RolService install methods

**TO DO**:

* Add unit test for `RolService.install` method
* Integrate RBAC and Authorizations (roles, permissions)
  * revisit `*.{list,store,show}` if `role.permissions` is allowed for the route.
  * revisit `*.{update,archive,destroy}` as `auth.id` in `users.each.id`
* Create README.md
* Setup initial `librarivm/ui` repository.
  * Decided to have the front-end to a separate repository.
  * They'd just be deployed and set up from one installer.
* Add plugins support?
