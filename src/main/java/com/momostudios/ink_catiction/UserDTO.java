package com.momostudios.ink_catiction;

public class UserDTO {
	private final String username;
	private final float volume;

	public UserDTO(User user) {
		username = user.getUsername();
		volume = user.getVolume();
	}

	public String getUsername() {
		return this.username;
	}

	public float getVolume() {
		return this.volume;
	}

}
