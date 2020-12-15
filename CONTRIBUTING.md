# Contributing

First off, thanks for taking the time to contribute! This guide will answer
some common questions about how this project works.

While this is a Pinterest open source project, we welcome contributions from
everyone. Regular outside contributors can become project maintainers.

## Help

If you're having trouble using this project, please start by reading the [`README.md`](README.md)
and searching for solutions in the existing open and closed issues.

## Code of Conduct

Please be sure to read and understand our [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
We work hard to ensure that our projects are welcoming and inclusive to as many
people as possible.

## Reporting Issues

If you have a bug report, please provide as much information as possible so that
we can help you out:

- Version of the project you're using.
- Code which reproduces the issue.
- Steps which reproduce the issue.
- Stack traces for crashes.
- Any logs produced.

## Making Changes

1. Fork this repository to your own account.
1. Make changes or add a new rule in the `src/rules` directory.
1. Run `npm run typecheck` to type-check your code.
1. Run `npm run build` or `npm run watch` to compile your code into standalone rules.
1. [Add the new or modified rules to your config](README.md#Installation) and test them with a sample schema.
1. Commit your work and push to a new branch on your fork.
1. Submit a pull request.
1. Participate in the code review process by responding to feedback.

Once there is agreement that the code is in good shape, one of the project's
maintainers will merge your contribution.

To increase the chances that your pull request will be accepted:

- Follow the coding style
- Write tests for your changes
- Write a good commit message

## License

By contributing to this project, you agree that your contributions will be
licensed under its [license](LICENSE).