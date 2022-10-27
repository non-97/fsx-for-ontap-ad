#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { FsxnStack } from "../lib/fsxn-stack";

const app = new cdk.App();
new FsxnStack(app, "FsxnStack");
