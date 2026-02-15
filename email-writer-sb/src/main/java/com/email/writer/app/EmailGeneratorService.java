package com.email.writer.app;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import reactor.util.retry.Retry;
import java.time.Duration;
import org.springframework.web.reactive.function.client.WebClientResponseException;


import java.util.List;
import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService() {
        this.webClient = WebClient.builder().build();
    }


    public String generateEmailReply(EmailRequest emailRequest){
    System.out.println("Gemini URL: " + geminiApiUrl);
    System.out.println("Gemini KEY: " + geminiApiKey);

    // build the prompt
    String prompt = buildPrompt(emailRequest);

    // craft request body (added generationConfig to reduce token usage)
    Map<String, Object> requestBody = Map.of(
            "contents", new Object[]{
                    Map.of("parts", new Object[]{
                            Map.of("text", prompt)
                    })
            },
            "generationConfig", Map.of(
                    "maxOutputTokens", 300
            )
    );

    try {
        // Do request and get response (added retry with backoff)
        String response = webClient.post()
                .uri(geminiApiUrl)
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", geminiApiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .retryWhen(
                        reactor.util.retry.Retry.backoff(3, java.time.Duration.ofSeconds(3))
                                .filter(ex -> ex instanceof org.springframework.web.reactive.function.client.WebClientResponseException.TooManyRequests)
                )
                .block();

        // Extract response and return
        return extractResponseContent(response);

    } catch (org.springframework.web.reactive.function.client.WebClientResponseException.TooManyRequests e) {
        return "Too many requests. Please wait 15–20 seconds and try again.";
    } catch (Exception e) {
        return "Error occurred: " + e.getMessage();
    }
}


    private String extractResponseContent(String response) {
        try{
            ObjectMapper mapper=new ObjectMapper();
            JsonNode rootNode=mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        }catch(Exception e){
            return "Error processing request:" + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt=new StringBuilder();
        prompt.append("Generate a Professional email reply for the following email content. Please don't generate a subject line ");
        if(emailRequest.getTone()!=null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone.");
        }
        prompt.append("\nOriginal email: \n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
