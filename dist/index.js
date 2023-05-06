"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const github = require("@actions/github");
const core_1 = require("@octokit/core");
const openai_1 = require("openai");
const runSummaryAction = () => __awaiter(void 0, void 0, void 0, function* () {
    if (github.context.eventName !== "pull_request") {
        // The core module on the other hand let's you get
        // inputs or create outputs or control the action flow
        // e.g. by producing a fatal error
        core.setFailed("Can only run on pull requests!");
        return;
    }
    const github_token = core.getInput("GITHUB_TOKEN");
    const openai_key = core.getInput("OPENAI_API_KEY");
    const octokit = new core_1.Octokit({
        auth: github_token,
    });
    const configuration = new openai_1.Configuration({
        apiKey: openai_key,
    });
    const openai = new openai_1.OpenAIApi(configuration);
    // get the pr details
    const { repo, owner, number } = github.context.issue;
    try {
        const response = yield octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
            owner,
            repo,
            pull_number: number,
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });
        const { title, body, patch_url } = response.data;
        const summaryResponse = yield openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Pull Request Summary: Title: ${title} Description: ${body || ""} Diff: ${patch_url}`,
            temperature: 0.7,
            max_tokens: 100,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        yield octokit.request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
            owner,
            repo,
            issue_number: number,
            body: summaryResponse.data.choices[0].text || "",
            headers: {
                "X-GitHub-Api-Version": "2022-11-28",
            },
        });
    }
    catch (error) {
        console.log(error);
        core.setFailed("something went wrong");
    }
});
runSummaryAction();
