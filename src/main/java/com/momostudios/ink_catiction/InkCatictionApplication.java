package com.momostudios.ink_catiction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
@EnableWebSocket
public class InkCatictionApplication implements WebSocketConfigurer
{
	private final InkWebSocketHandler inkWebSocketHandler;

	public InkCatictionApplication(InkWebSocketHandler inkWebSocketHandler) {
		this.inkWebSocketHandler = inkWebSocketHandler;
	}

	public static void main(String[] args) {
		SpringApplication.run(InkCatictionApplication.class, args);
	}

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(inkWebSocketHandler, "/ws")
				.setAllowedOrigins("*");
	}

	@Bean
	public InkWebSocketHandler getInkWebSocketHandler() {
		return new InkWebSocketHandler();
	}

	@Bean
	public WebSecurityCustomizer webSecurityCustomizer() {
		return (web) -> web.ignoring().requestMatchers(
		new AntPathRequestMatcher("/**")
		);
	}
}
