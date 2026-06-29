# Contributing to CardioPulse

We welcome contributions from the open-source community to improve CardioPulse! Please follow these guidelines to make contributing simple and effective.

## Code of Conduct
By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. **Fork the Repository**: Create your own copy of the repository.
2. **Setup Locally**: Follow the installation guidelines in the root [README.md](README.md) to set up your Python virtual environment and Node dependencies.
3. **Create a Feature Branch**: Make your changes in a branch named `feature/your-feature-name` or `bugfix/issue-id`.
4. **Implement Tests**: Write corresponding unit tests in `tests/` for any new backend functionality.
5. **Verify Builds & Tests**:
   ```bash
   # Verify backend tests pass
   PYTHONPATH=. pytest tests/
   
   # Verify frontend builds successfully
   npm run build --prefix frontend
   ```

## Pull Request Guidelines

1. Submit your pull request against the `main` branch.
2. Fill out the [Pull Request Template](.github/pull_request_template.md) completely.
3. Ensure the GitHub Actions CI pipeline passes successfully.
4. Keep pull requests focused on a single issue or feature area.
