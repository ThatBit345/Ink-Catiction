package com.momostudios.ink_catiction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@SpringBootApplication
public class InkCatictionApplication {

	@Bean
	public WebSecurityCustomizer webSecurityCustomizer() {
		return (web) -> web.ignoring().requestMatchers(
		new AntPathRequestMatcher("/**")
		);
	}

	public static void main(String[] args) {
		System.out.println( "Working dir: " + System.getProperty("user.dir"));
		SpringApplication.run(InkCatictionApplication.class, args);
	}
}
