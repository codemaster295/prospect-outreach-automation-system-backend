import EmailContentGenerator from "./utils/openAI-email-generator"; // Adjust path if needed

async function testEmailGenerator() {
  const prompt = "Write a follow-up email to a client about our new product launch.";
  let backendBody = "dsds"
  try {
    console.log("Testing email generation...");

    const emailContent = await EmailContentGenerator.generateEmailContent(prompt, {
      tone: "friendly",
      length: "short",
    });

    console.log("\n Generated Email Content:\n", emailContent);
  } catch (error) {
    console.error("\n Error:", error);
  }
}

testEmailGenerator();



// azur service
// import EmailContentGenerator from "./utils/openAI-email-generator"; 

// async function testEmailGenerator()  {
//   const emailGen = new EmailContentGenerator();
//   const prompt = "Write a follow-up email to a client after a business meeting.";

//   try {
//     const emailContent = await emailGen.generateEmail(prompt, "polite");
//     console.log("Generated Email:\n", emailContent);
//   } catch (error) {
//     console.error("Failed to generate email:", error);
//   }
// };

// testEmailGenerator();