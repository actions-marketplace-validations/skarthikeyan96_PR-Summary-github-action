import * as core from '@actions/core'
import * as github from '@actions/github'
import axios from 'axios'


const runSummaryAction = async () => {

    if (github.context.eventName !== "pull_request") {
        // The core module on the other hand let's you get
        // inputs or create outputs or control the action flow
        // e.g. by producing a fatal error
        core.setFailed("Can only run on pull requests!");
        return;
     }


    const github_token = core.getInput('GITHUB_TOKEN')
    const openai_key = core.getInput('OPENAI_API_KEY')

    // get the pr details

    //  const res = await axios.get(`https://api.github.com/repos/${github.repository}/pulls/${github.event.pull_request.number}`)
     console.log(github.context.issue)


}

runSummaryAction()

