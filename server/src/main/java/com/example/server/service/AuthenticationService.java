package com.example.server.service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.example.server.exception.AppException;
import com.example.server.exception.ErrorCode;
import com.example.server.model.dto.reponse.AuthenticationDto;
import com.example.server.model.dto.reponse.TokenDto;
import com.example.server.model.dto.reponse.VerifyTokenDto;
import com.example.server.model.dto.request.AuthenticationRequest;
import com.example.server.model.dto.request.LogoutRequest;
import com.example.server.model.dto.request.VerifyTokenRequest;
import com.example.server.model.entity.InvalidToken;
import com.example.server.model.entity.User;
import com.example.server.repository.InvalidatedTokenRepository;
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
    @Autowired
    InvalidatedTokenRepository invalidatedTokenRepository;
    @NonFinal
    @Value("${jwt.signer_key}")
    protected String SIGNER_KEY;


    public AuthenticationDto authenticate(AuthenticationRequest request){
        var user = userRepository.findByUserEmail(request.userEmail())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        boolean authenticated = passwordEncoder.matches(request.userPassword(), user.getUserPassword());
        
        if(!authenticated){
            throw new AppException(ErrorCode.WRONG_PASSWORD);
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
            .jwtID(UUID.randomUUID().toString())
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
        boolean isValid = true;
        try {
            CheckToken(token);
        } catch (AppException e) {
            isValid = false;
        }

       return VerifyTokenDto.builder()
            .Valid(isValid)
            .build();
        
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException{
        var signToken = CheckToken(request.token());

        String jwt = signToken.getJWTClaimsSet().getJWTID();
        Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

        InvalidToken invalidToken = InvalidToken.builder()
            .id(jwt)
            .expiryTime(expiryTime)
            .build();
        invalidatedTokenRepository.save(invalidToken);
        
    }

    private SignedJWT CheckToken(String token) throws ParseException, JOSEException{
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token); 
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
       var verified = signedJWT.verify(verifier);
       if(!(verified && expiryTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        if(invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())){
            throw new AppException(ErrorCode.TOKEN_INVALID);
        }
        return signedJWT;
    }

    public TokenDto getUserInfo(VerifyTokenRequest request) throws ParseException, JOSEException{
        var token = request.token();
        SignedJWT signedJWT = SignedJWT.parse(token);
        var claims = signedJWT.getJWTClaimsSet();
        return TokenDto.builder()
            .userEmail(claims.getSubject())
            .userId(claims.getStringClaim("userId"))
            .role(claims.getStringClaim("scope"))
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
