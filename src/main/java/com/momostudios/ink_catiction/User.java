package com.momostudios.ink_catiction;

public class User {
    private String username;
    private String password;
	private float volume;
    // private int lastScore;


    public User(String argUsername, String argPassword, float argVolume) {
        username = argUsername;
        password = argPassword;
		volume = argVolume;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

	public float getVolume(){
		return volume;
	}

    public void setName(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

	public void setVolume(float volume){
		this.volume = volume;
	}
}
