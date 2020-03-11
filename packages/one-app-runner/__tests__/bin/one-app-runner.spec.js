// explicitly requiring within each test needed in order to have independent mocks
/* eslint-disable global-require */
const path = require('path');

const originalProcessExit = process.exit;
const originalProcessArgv = process.argv;

beforeAll(() => {
  process.exit = jest.fn();
});

beforeEach(() => {
  jest
    .resetModules()
    .restoreAllMocks()
    .resetAllMocks();

  process.argv = originalProcessArgv;
});

afterAll(() => {
  process.argv = originalProcessArgv;
  process.exit = originalProcessExit;
});

test('command errors out if --module-map-url option is not given a value', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');

  process.argv = ['', '', '--module-map-url'];
  jest.mock('../../src/startApp', () => jest.fn());
  require('../../bin/one-app-runner');
  expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
});

test('command errors out if --module-map-url option is not given', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');

  process.argv = ['', '', '--root-module-name', 'frank-lloyd-root', '--docker-image', 'one-app:5.0.0'];
  jest.mock('../../src/startApp', () => jest.fn());
  require('../../bin/one-app-runner');
  expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
});

test('command errors out if --root-module-name option is not given a value', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');

  process.argv = ['', '', '--root-module-name'];
  jest.mock('../../src/startApp', () => jest.fn());
  require('../../bin/one-app-runner');
  expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
});

test('command errors out if --root-module-name option is not given', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');

  process.argv = ['', '', '--module-map-url', 'https://example.com/module-map.json', '--docker-image', 'one-app:5.0.0'];
  jest.mock('../../src/startApp', () => jest.fn());
  require('../../bin/one-app-runner');
  expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
});

test('command errors out if --docker-image option is not given a value', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');

  process.argv = ['', '', '--docker-image'];
  jest.mock('../../src/startApp', () => jest.fn());
  require('../../bin/one-app-runner');
  expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
});

test('command errors out if --docker-image option is not given', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');

  process.argv = ['', '', '--module-map-url', 'https://example.com/module-map.json', '--root-module-name', 'frank-lloyd-root'];
  jest.mock('../../src/startApp', () => jest.fn());
  require('../../bin/one-app-runner');
  expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
});


test('--parrot-middleware, --modules, --output-file, and --dev-endpoints values are coerced into absolute paths', () => {
  const modulesPath = '../fake/path/to/fake-module';
  const parrotMiddlewarePath = '../fake/path/to/fake-module/dev.middleware.js';
  const outputFile = '../fake/path/to/fake-module/one-app.log';
  const devEndpointsFilePath = '../fake/path/to/fake-module/dev.endpoints.js';

  process.argv = [
    '',
    '',
    '--modules',
    modulesPath,
    '--parrot-middleware',
    parrotMiddlewarePath,
    '--output-file',
    outputFile,
    '--dev-endpoints',
    devEndpointsFilePath,
  ];
  jest.mock('../../src/startApp', () => jest.fn());
  const startApp = require('../../src/startApp');

  require('../../bin/one-app-runner');

  expect(
    path.isAbsolute(startApp.mock.calls[0][0].parrotMiddlewareFile)
  ).toBeTruthy();
  expect(
    path.isAbsolute(startApp.mock.calls[0][0].devEndpointsFile)
  ).toBeTruthy();
  expect(
    path.isAbsolute(startApp.mock.calls[0][0].modulesToServe[0])
  ).toBeTruthy();
});

test('command errors out if --dev-endpoints is not given a value', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');

  process.argv = ['', '', '--dev-endpoints'];
  jest.mock('../../src/startApp', () => jest.fn(() => Promise.resolve()));
  require('../../bin/one-app-runner');
  expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
});

test('command errors out if --modules option is not given any values', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');

  process.argv = ['', '', '--modules'];
  jest.mock('../../src/startApp', () => jest.fn(() => Promise.resolve()));
  require('../../bin/one-app-runner');
  expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
});

test('--parrot-middleware, --module values, --output-file, and --dev-endpoints are left alone if already absolute paths', () => {
  const modulesPath = path.resolve('/fake/path/to/fake-module');
  const parrotMiddlewarePath = path.resolve('/fake/path/to/fake-module/dev.middleware.js');
  const outputFile = path.resolve('/fake/path/to/fake-module/one-app.log');
  const devEndpointsFilePath = path.resolve('/fake/path/to/fake-module/dev.endpoints.js');

  process.argv = [
    '',
    '',
    '--modules',
    modulesPath,
    '--parrot-middleware',
    parrotMiddlewarePath,
    '--output-file',
    outputFile,
    '--dev-endpoints',
    devEndpointsFilePath,
  ];
  jest.mock('../../src/startApp', () => jest.fn());
  const startApp = require('../../src/startApp');
  require('../../bin/one-app-runner');

  expect(
    startApp.mock.calls[0][0].modulesToServe[0]
  ).toBe(modulesPath);
  expect(
    startApp.mock.calls[0][0].parrotMiddlewareFile
  ).toBe(parrotMiddlewarePath);
  expect(
    startApp.mock.calls[0][0].devEndpointsFile
  ).toBe(devEndpointsFilePath);
});

test('all options are used if specified', () => {
  const dockerImage = 'one-app:5.0.0';
  const devEndpointsFile = path.resolve('/fake/path/to/fake-module/dev.endpoints.js');
  const envVars = 'MY_ENV_VAR=value';
  const moduleMapUrl = 'httops://example.com/module-map.json';
  const modulesPath = path.resolve('/fake/path/to/fake-module');
  const outputFile = path.resolve('/fake/path/to/fake-module/one-app.log');
  const parrotMiddlewarePath = path.resolve('/fake/path/to/fake-module/dev.middleware.js');
  const rootModuleName = 'frank-lloyd-root';

  process.argv = [
    '',
    '',
    '--docker-image',
    dockerImage,
    '--dev-endpoints',
    devEndpointsFile,
    '--env-vars',
    envVars,
    '--module-map-url',
    moduleMapUrl,
    '--modules',
    modulesPath,
    '--output-file',
    outputFile,
    '--parrot-middleware',
    parrotMiddlewarePath,
    '--root-module-name',
    rootModuleName,
  ];

  jest.mock('../../src/startApp', () => jest.fn());
  const startApp = require('../../src/startApp');
  require('../../bin/one-app-runner');

  expect(startApp.mock.calls).toMatchSnapshot();
});

test('command errors out if an unknown option is given', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');

  process.argv = ['', '', '--not-a-valid-option', '--root-module-name', 'frank-lloyd-root', '--module-map-url', 'https://example.com/module-map.json', '--docker-image', 'one-app:5.0.0'];
  jest.mock('../../src/startApp', () => jest.fn());
  require('../../bin/one-app-runner');
  expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
});

test('--modules option is required if --parrot-middleware option is given', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');

  process.argv = ['', '', '--parrot-middleware', '../path/to/dev.middleware.js', '--root-module-name', 'frank-lloyd-root', '--module-map-url', 'https://example.com/module-map.json', '--docker-image', 'one-app:5.0.0'];
  jest.mock('../../src/startApp', () => jest.fn());
  require('../../bin/one-app-runner');
  expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
});

test('--modules option is required if --dev-endpoints option is given', () => {
  const consoleErrorSpy = jest.spyOn(console, 'error');

  process.argv = ['', '', '--dev-endpoints', '../path/to/dev.endpoints.js', '--root-module-name', 'frank-lloyd-root', '--module-map-url', 'https://example.com/module-map.json', '--docker-image', 'one-app:5.0.0'];
  jest.mock('../../src/startApp', () => jest.fn());
  require('../../bin/one-app-runner');
  expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
});

test('an `envVars` key is supported within the config entry', () => {
  jest.mock('../../../../package.json', () => ({
    'one-amex': {
      runner: {
        envVars: {
          MY_COOL_CONFIG_VARIABLE: 'is-the-best',
        },
      },
    },
  }));

  jest.mock('../../src/startApp', () => jest.fn());
  const startApp = require('../../src/startApp');
  require('../../bin/one-app-runner');

  expect(startApp.mock.calls[0][0].envVars)
    .toHaveProperty('MY_COOL_CONFIG_VARIABLE', 'is-the-best');
});

test('an `envVars` arg is supported', () => {
  jest.unmock('../../../../package.json');

  process.argv = [
    '',
    '',
    '--envVars',
    '{ "MY_VARIABLE": "my-variable", "HELLO": "WORLD" }',
  ];

  jest.mock('../../src/startApp', () => jest.fn());
  const startApp = require('../../src/startApp');

  require('../../bin/one-app-runner');
  expect(startApp.mock.calls[0][0].envVars).toMatchSnapshot();
});