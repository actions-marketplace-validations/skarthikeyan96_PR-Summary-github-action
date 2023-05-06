import * as core from '@actions/core'
import * as github from '@actions/github'

const runSummaryAction = () => {

    // if (github.context.eventName !== "pull_request") {
    //     // The core module on the other hand let's you get
    //     // inputs or create outputs or control the action flow
    //     // e.g. by producing a fatal error
    //     core.setFailed("Can only run on pull requests!");
    //     return;
    //   }


    const github_token = core.getInput('GITHUB_TOKEN')
    const openai_key = core.getInput('OPENAI_API_KEY')

    console.log(github_token);

}

runSummaryAction()

