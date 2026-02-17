package com.placement.platform.auth;

import com.placement.platform.domain.Role;
import com.placement.platform.domain.User;
import com.placement.platform.repository.UserRepository;
import com.placement.platform.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

        private final UserRepository repository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationResponse register(RegisterRequest request) {
                var user = User.builder()
                                .fullName(request.getFullName())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(request.getRole() != null ? request.getRole() : Role.STUDENT)
                                .build();
                repository.save(user);
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();
        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getEmail(),
                                                request.getPassword()));
                var user = repository.findByEmail(request.getEmail())
                                .orElseThrow();
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                                .token(jwtToken)
                                .build();
        }

        public AuthenticationResponse loginWithGoogle(String idTokenString) {
                try {
                        com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier verifier = new com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier.Builder(
                                        new com.google.api.client.http.javanet.NetHttpTransport(),
                                        new com.google.api.client.json.gson.GsonFactory())
                                        .setAudience(java.util.Collections.singletonList("YOUR_GOOGLE_CLIENT_ID"))
                                        .build();

                        com.google.api.client.googleapis.auth.oauth2.GoogleIdToken idToken = verifier
                                        .verify(idTokenString);
                        if (idToken != null) {
                                com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload payload = idToken
                                                .getPayload();
                                String email = payload.getEmail();
                                String name = (String) payload.get("name");

                                // Check if user exists
                                var user = repository.findByEmail(email).orElse(null);
                                if (user == null) {
                                        // Register new user
                                        user = User.builder()
                                                        .fullName(name)
                                                        .email(email)
                                                        .password(passwordEncoder
                                                                        .encode("GOOGLE_AUTH_DEFAULT_PASSWORD")) // Dummy
                                                                                                                 // password
                                                        .role(Role.STUDENT)
                                                        .build();
                                        repository.save(user);
                                }

                                var jwtToken = jwtService.generateToken(user);
                                return AuthenticationResponse.builder()
                                                .token(jwtToken)
                                                .build();
                        } else {
                                throw new RuntimeException("Invalid ID token.");
                        }
                } catch (Exception e) {
                        throw new RuntimeException("Google Login Failed: " + e.getMessage());
                }
        }
}
