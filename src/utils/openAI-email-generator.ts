import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

interface EmailOptions {
    tone?: 'professional' | 'casual' | 'friendly' | 'formal';
    length?: 'short' | 'medium' | 'long';
}

interface Prospect {
    name: string;
    position: string;
    company: string;
    email: string;
    // Add other fields as necessary
}

interface CompanyDetails {
    name: string;
    description: string;
    product: string;
    valueProposition: string;
    // Add other fields as necessary
}

class EmailContentGenerator {
    private endpoint: string;
    private apiKey: string;
    private apiVersion: string;
    private deploymentId: string;

    constructor() {
        this.endpoint = process.env.AZURE_ENDPOINT as string;
        this.apiKey = process.env.AZURE_API_KEY as string;
        this.apiVersion = process.env.AZURE_API_VERSION as string;
        this.deploymentId = process.env.AZURE_DEPLOYMENT_ID as string;
    }

    /**
     * Constructs the XML prompt based on provided details.
     * @param prospect - Information about the prospect.
     * @param company - Information about the company.
     * @returns XML string representing the prompt.
     */
    private constructPrompt(
        prospect: Prospect,
        company: CompanyDetails,
    ): string {
        return `
<prompt>
    <context>
        <description>You are an expert in crafting professional outreach emails for freelancers. Your task is to generate a personalized email for a prospect, introducing the sender as a MERN Stack Developer freelancer and expressing interest in collaboration.</description>
    </context>
    <prospect>
        <name>${prospect.name}</name>
        <position>${prospect.position}</position>
        <company>${prospect.company}</company>
        <email>${prospect.email}</email>
        <!-- Add other prospect fields as necessary -->
    </prospect>
    <company_details>
        <name>${company.name}</name>
        <description>${company.description}</description>
        <product>${company.product}</product>
        <value_proposition>${company.valueProposition}</value_proposition>
        <!-- Add other company fields as necessary -->
    </company_details>
    <freelancer>
        <name>Meet Moradiya</name>
        <location>Surat, India</location>
        <expertise>MERN Stack Development (MongoDB, Express.js, React.js, Node.js)</expertise>
        <experience>Full stack developer with extensive experience in building scalable web applications and AI-powered solutions.</experience>
        <portfolio>https://meet-portfolio.vercel.app/</portfolio>
        <contact>meetmoradiya001@gmail.com</contact>
    </freelancer>
    <email_template>
        <subject> ${prospect.company}</subject>
        <body>
        Dear ${prospect.name},
            

  

            Best regards,
            **Meet Moradiya**
            Full Stack MERN Developer | Surat
            [portfolio]:(https://meet-portfolio.vercel.app/)
           email:${prospect.email}
        </body>
    </email_template>
</prompt>`;
    }

    /**
     * Generates email content using Azure OpenAI API.
     * @param prospect - Information about the prospect.
     * @param company - Information about the company.
     * @param options - Additional options for tone and length.
     * @returns A promise resolving to the generated email content.
     */
    async generateEmailContent(
        prospect: Prospect,
        company: CompanyDetails,
        options: EmailOptions = {},
    ): Promise<string> {
        const { tone = 'professional', length = 'medium' } = options;

        // Construct the XML prompt
        const prompt = this.constructPrompt(prospect, company);

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
                            content: `Generate an email with the following details: ${prompt}`,
                        },
                        {
                            role: 'user',
                            content: `The email should have a ${tone} tone and be ${length} in length.
                                  The response MUST be valid JSON and follow this strict structure:
                                    {
                                        "subject": "Email subject here",
                                        "body": "Email body here"
                                    }
                                    Do not include any extra text, explanations, or markdown formatting. Only return a raw JSON object.`,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 300,
                    response_format: { type: 'json_object' },
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
            return JSON.parse(messageContent);
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
