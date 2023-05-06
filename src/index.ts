import * as core from "@actions/core";
import * as github from "@actions/github";
import { Octokit } from "@octokit/rest";
import axios from "axios";

const runSummaryAction = async () => {
  if (github.context.eventName !== "pull_request") {
    // The core module on the other hand let's you get
    // inputs or create outputs or control the action flow
    // e.g. by producing a fatal error
    core.setFailed("Can only run on pull requests!");
    return;
  }

  const github_token = core.getInput("GITHUB_TOKEN");
  const openai_key = core.getInput("OPENAI_API_KEY");

  const octokit = new Octokit({
    auth: github_token,
  });

  // get the pr details

  const { repo, owner, number } = github.context.issue;
  const response = octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    {
      owner,
      repo,
      pull_number: number,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  console.log(response);
};

runSummaryAction();
