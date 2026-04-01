
package com.example.project_management_class;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.project_management_class")
public class ProjectManagementClassApplication {
	public static void main(String[] args) {
		SpringApplication.run(ProjectManagementClassApplication.class, args);
	}
}