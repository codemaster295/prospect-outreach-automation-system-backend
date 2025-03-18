import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
    tone?: 'professional' | 'casual' | 'friendly' | 'formal';
    length?: 'short' | 'medium' | 'long';
}

class EmailContentGenerator {
    private endpoint: string;
    private apiKey: string;
    private apiVersion: string;
    private deploymentId: string;

    constructor() {
        this.endpoint = process.env.AZURE_ENDPOINT as string;
        this.apiKey = process.env.AZURE_API_KEY as string;;
        this.apiVersion = process.env.AZURE_API_VERSION as string;
        this.deploymentId = process.env.AZURE_DEPLOYMENT_ID as string;
    }

    /**
     * Generates email content using Azure OpenAI API.
     * @param prompt - Description of the email content.
     * @param options - Additional options for tone and length.
     * @returns A promise resolving to the generated email content.
     */
    async generateEmailContent(
        prompt: string,
        options: EmailOptions = {},
    ): Promise<string> {
        const { tone = 'professional', length = 'medium' } = options;

        try {
            const response = await axios.post(
                `${this.endpoint}/openai/deployments/${this.deploymentId}/chat/completions?api-version=${this.apiVersion}`,
                {
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert email writer.',
                        },
                        {
                            role: 'user',
                            content: `Generate an email with the following details: ${prompt}.`,
                        },
                        {
                            role: 'user',
                            content: `The email should have a ${tone} tone and be ${length} in length.`,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 300,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': this.apiKey,
                    },
                },
            );

            // Ensure response.choices exists and is not empty
            if (!response.data.choices || response.data.choices.length === 0) {
                throw new Error('No choices returned from Azure OpenAI API.');
            }

            // Ensure message and content exist
            const messageContent = response.data.choices[0]?.message?.content;
            if (!messageContent) {
                throw new Error('No content returned in response message.');
            }

            return messageContent.trim();
        } catch (error: any) {
            console.error('Error generating email content:', error);

            if (error.response) {
                console.error('Azure OpenAI API error:', error.response.data);

                // Handle quota errors
                if (error.response.status === 429) {
                    console.log(
                        'Error: Rate limit or quota exceeded. Check your Azure subscription.',
                    );
                    return 'Error: Rate limit or quota exceeded. Check your Azure subscription.';
                }
            }

            return 'An error occurred while generating the email content.';
        }
    }
}

export default new EmailContentGenerator();
