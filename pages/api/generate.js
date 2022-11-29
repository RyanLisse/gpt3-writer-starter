import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix =
    `
Write me a tweet post in the style of the stoic philosophers or Yoda a legendary Jedi Master  with the title below. Please make sure the twitter post sounds like ryan holiday and shows that the writer did their research.

Title:
`;
const finalPromptPrefix = 'Take the tweet below and generate 5 tweets:\n';

const generateAction = async (req, res) => {
    // Run first prompt
    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: `${basePromptPrefix}${req.body.userInput}\n`,
        temperature: 0.87,
        max_tokens: 1250,
    });

    const baseChoice = baseCompletion.data.choices.pop();

    // Run second prompt with prefix
    const finalPrompt = `${finalPromptPrefix}${req.body.input}${baseChoice.text}`;

    const prefixCompletion = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: finalPrompt,
        temperature: 0.7,
        max_tokens: 2048,
    });

    const finalChoice = prefixCompletion.data.choices.pop();

    res.status(200).json({ baseChoice, finalChoice });
};

export default generateAction;