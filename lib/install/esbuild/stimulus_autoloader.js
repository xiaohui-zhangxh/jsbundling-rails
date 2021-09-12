import { Application } from "stimulus"
import { identifierForContextKey } from "stimulus/webpack-helpers"

const application = Application.start()

import { context } from './**/*_controller.js';
const controllers = Object.keys(context).map((filename) => ({
  identifier: identifierForContextKey(filename),
  controllerConstructor: context[filename] }))

application.load(controllers)
