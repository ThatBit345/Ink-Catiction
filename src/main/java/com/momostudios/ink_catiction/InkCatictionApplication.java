package com.momostudios.ink_catiction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class InkCatictionApplication {

	/*
	// Para que las dependencias se inyecten solas
	@Bean
	public ApiStatusServide getStatusService() {
	
	}
	*/

	public static void main(String[] args) {
		SpringApplication.run(InkCatictionApplication.class, args);
	}

}
