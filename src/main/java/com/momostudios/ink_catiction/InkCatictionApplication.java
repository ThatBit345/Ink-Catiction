package com.momostudios.ink_catiction;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class InkCatictionApplication {

	/*
	// Para que las dependencias se inyecten solas
	@Bean
	public ApiStatusService getStatusService() {
	
	}
	*/

	public static void main(String[] args) {
		System.out.println( "Working dir: " + System.getProperty("user.dir"));
		SpringApplication.run(InkCatictionApplication.class, args);
	}
}
