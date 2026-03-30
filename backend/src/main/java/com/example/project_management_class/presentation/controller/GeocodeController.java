package com.example.project_management_class.presentation.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/geocode")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GeocodeController {

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/reverse")
    public ResponseEntity<Map<String, Object>> reverse(
            @RequestParam("lat") double lat,
            @RequestParam("lon") double lon
    ) {
        String url = "https://nominatim.openstreetmap.org/reverse"
                + "?format=jsonv2"
                + "&lat=" + lat
                + "&lon=" + lon
                + "&accept-language=vi";

        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(MediaType.parseMediaTypes("application/json"));
        // Nominatim usage policy requires a valid User-Agent identifying the application.
        headers.set("User-Agent", "project-management-class/1.0");

        try {
            ResponseEntity<String> res = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class
            );

            String body = res.getBody();
            String address = "";
            if (body != null && !body.isBlank()) {
                JsonNode root = objectMapper.readTree(body);
                JsonNode display = root.get("display_name");
                if (display != null && !display.isNull()) {
                    address = display.asText("");
                }
            }
            return ResponseEntity.ok(Map.of(
                    "lat", lat,
                    "lon", lon,
                    "address", address
            ));
        } catch (Exception e) {
            // Don't fail attendance because reverse geocoding failed.
            return ResponseEntity.ok(Map.of(
                    "lat", lat,
                    "lon", lon,
                    "address", ""
            ));
        }
    }
}

