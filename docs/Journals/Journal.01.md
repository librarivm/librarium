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

- Move Journal.md to Obsidian
- Added UserService with authentication methods and their unit tests
- Added initial functional tests for registering a user
- Add authentication via access_token
- Add feature: `auth.register` functional test and its failed scenarios

**TO DO:**

- Continue working on with the login feature and its unit + functional tests

* Journal.md Then set up a backup system there.
* Continue developing the tests for `libraries.store`
* Add validation and its tests for library; revisit any potential test breakages

## Jul 7, 2024

**DONE**:

- Added login feature and its unit + functional tests
- Added logout feature and its functional test
- Refactored some types for registration classes
- Added `auth.me` feature and its functional tests
- Decided to just add the Journal.md in the project itself; is the best way to back up, and easy access
- Added auth middleware to libraries routes
- Added validation functional test to `libraries.store`
- Added `libraries.update` feature and its functional tests
- Added `libraries.archive` feature and its functional tests

**TO DO**:

- Add `libraries.delete` feature and its functional tests
- Fix ts type issues
- Integrate RBAC and Authorizations (roles, permissions)
- Create README.md
- Setup initial `librarivm/ui` repository.
  - Decided to have the front-end to a separate repository.
  - They'd just be deployed and set up from one installer.

## Jul, 8 2024

**DONE**:

- Added validating of slug uniqueness for `librarues.{store,update}`
- Added `libraries.delete` feature and its functional tests
- Fixed ts type issues
- Added permissions feature with installation method and its unit tests
- Added role service and its unit tests
- Added `roles.index` endpoint and its functional tests
- Added `roles.show` endpoint and its functional tests
  - Added `roles.users` and `roles.permissions` relations
- Added `roles.store` endpoint and its functional tests
- Added `roles.update` endpoint and its functional tests
- Added `roles.archive` endpoint and its functional tests
- Added `roles.destroy` endpoint and its functional tests

**TO DO**:

- Integrate RBAC and Authorizations (roles, permissions)
  - revisit `*.{list,store,show}` if `role.permissions` is allowed for the route.
  - revisit `*.{update,archive,destroy}` as `auth.id` in `users.each.id`
- Create README.md
- Setup initial `librarivm/ui` repository.
  - Decided to have the front-end to a separate repository.
  - They'd just be deployed and set up from one installer.
- Add plugins support?

## Jul 9, 2024

**DONE**:

- Refactored services interfaces to be types
- Added unit tests for RolService install methods
- Test flukes: sometimes a file will fail a test on CI but not on local
  - What seemed to work: touch the file and send it to CI again. Will miraculously work again 🤷.
- Added unit test for `RolService.install` method

## Jul 10, 2024

**DONE**:

- Integrated RBAC and Authorizations (roles, permissions)
- Refactored a lot of the functional tests to handle role-based authorization
- Set up CI health checks
- RBAC: revisit `*.{list,store,show}` if `role.permissions` is allowed for the route.

## Jul 11, 2024

**DONE**:

- Added RBAC(libraries): owners can only view, archive, delete their own resources
- Added RBAC(roles): owners can only view, archive, delete their own resources
- Done: RBAC: revisit `*.{update,archive,destroy}` as `auth.id` in `users.each.id`
- Added unit tests for all permissions
- Added `users.index` endpoint and its functional tests
- Added `users.show` endpoint and its functional tests
- Added `users.store` endpoint and its functional tests

## Jul 12, 2024

**DONE**:

- Added `users.update` endpoint and its functional tests
- Added `users.archive` endpoint and its functional tests
- Added `users.destroy` endpoint and its functional tests
- Added user policy and its functional tests
- Updated `createAuthenticatedUser` parameter to require Permissions
- Create service method to convert snake_case to camelCase.
- Fixed issue: empty middleName is not being saved by setting validator to `nullable`

**TO DO**:

- Add collection class to transform data and generate links
- Add `permissions.list`
- Restore function `resource.restore`
- Archived options in `resource.index`
  - allow for:
    ```ts
    route('resource.index', { with_archived: true });
    route('resource.index', { only_archived: true });
    ```
- Create README.md
  - Center logo
  - add section for Bruno
- Add docs/api (bruno)
- Add default user role on registration
- Setup initial `librarivm/ui` repository.
  - Decided to have the front-end to a separate repository.
  - They'd just be deployed and set up from one installer.
- Add media service
- Add media endpoints
- Add media policies
- Add plugins support?
- Caching system
- Queued jobs

Resources:

- resource migration
- resource factory
- resource seeder
- resource service
- resource model
- resource routes
- resource policy
