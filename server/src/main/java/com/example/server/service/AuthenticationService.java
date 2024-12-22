package com.example.server.service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.example.server.exception.AppException;
import com.example.server.exception.ErrorCode;
import com.example.server.model.dto.reponse.AuthenticationDto;
import com.example.server.model.dto.reponse.VerifyTokenDto;
import com.example.server.model.dto.request.AuthenticationRequest;
import com.example.server.model.dto.request.VerifyTokenRequest;
import com.example.server.model.entity.User;
import com.example.server.repository.UserRepository;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;


@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @NonFinal
    @Value("${jwt.signer_key}")
    protected String SIGNER_KEY;


    public AuthenticationDto authenticate(AuthenticationRequest request){
        var user = userRepository.findByUserEmail(request.userEmail())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        boolean authenticated = passwordEncoder.matches(request.userPassword(), user.getUserPassword());
        
        if(!authenticated){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        var token = generateToken(user);
        return  AuthenticationDto.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    private String generateToken(User user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);         
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
            .subject(user.getUserEmail())
            .issuer("Catfeine.com")
            .issueTime(new Date())
            .claim("userId", user.getUserId())
            .claim("scope", buildScope(user))
            .expirationTime(new Date(
                Instant.now().plus(1, ChronoUnit.DAYS).toEpochMilli()
            ))
            .build();
        
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            System.err.println("Error while signing the JWS object: " + e.getMessage());
            throw new RuntimeException(e);
        }

    }

    public VerifyTokenDto verifyToken(VerifyTokenRequest request) throws ParseException, JOSEException{
        var token = request.token();
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token); 
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
       var verified = signedJWT.verify(verifier);

       return VerifyTokenDto.builder()
            .Valid(verified && expiryTime.after(new Date()))
            .build();
        
    }
    private String buildScope(User user){
        StringJoiner stringJoiner = new StringJoiner(" ");
        if(!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(stringJoiner::add);
        }
        return stringJoiner.toString(); 
    }
}
