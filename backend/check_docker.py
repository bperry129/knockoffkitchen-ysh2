#!/usr/bin/env python
import subprocess
import json
import sys
import os

def check_docker_running():
    """Check if Docker is running"""
    try:
        result = subprocess.run(["docker", "info"], capture_output=True, text=True)
        return result.returncode == 0
    except Exception as e:
        print(f"Error checking Docker: {e}")
        return False

def get_postgres_container():
    """Get the PostgreSQL container details"""
    try:
        # List all containers
        result = subprocess.run(
            ["docker", "ps", "--filter", "name=postgres", "--format", "{{json .}}"],
            capture_output=True, text=True
        )
        
        if result.returncode != 0:
            print(f"Error listing Docker containers: {result.stderr}")
            return None
        
        # Parse the output
        containers = []
        for line in result.stdout.strip().split('\n'):
            if line:
                try:
                    container = json.loads(line)
                    containers.append(container)
                except json.JSONDecodeError:
                    print(f"Error parsing container info: {line}")
        
        if not containers:
            print("No PostgreSQL containers found")
            return None
        
        return containers[0]
    except Exception as e:
        print(f"Error getting PostgreSQL container: {e}")
        return None

def get_container_ip(container_id):
    """Get the IP address of a Docker container"""
    try:
        result = subprocess.run(
            ["docker", "inspect", "--format", "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}", container_id],
            capture_output=True, text=True
        )
        
        if result.returncode != 0:
            print(f"Error inspecting container: {result.stderr}")
            return None
        
        ip_address = result.stdout.strip()
        if not ip_address:
            print(f"No IP address found for container {container_id}")
            return None
        
        return ip_address
    except Exception as e:
        print(f"Error getting container IP: {e}")
        return None

def start_postgres_container():
    """Start the PostgreSQL container"""
    try:
        # Check if the container exists but is stopped
        result = subprocess.run(
            ["docker", "ps", "-a", "--filter", "name=postgres", "--format", "{{.ID}}"],
            capture_output=True, text=True
        )
        
        container_id = result.stdout.strip()
        if container_id:
            print(f"Starting existing PostgreSQL container {container_id}...")
            start_result = subprocess.run(["docker", "start", container_id], capture_output=True, text=True)
            if start_result.returncode != 0:
                print(f"Error starting container: {start_result.stderr}")
                return False
            return True
        else:
            print("No existing PostgreSQL container found")
            return False
    except Exception as e:
        print(f"Error starting PostgreSQL container: {e}")
        return False

def main():
    """Main function"""
    # Check if Docker is running
    if not check_docker_running():
        print("Docker is not running")
        return 1
    
    # Get the PostgreSQL container
    container = get_postgres_container()
    if not container:
        print("No PostgreSQL container found, trying to start one...")
        if not start_postgres_container():
            print("Failed to start PostgreSQL container")
            return 1
        
        # Check again after starting
        container = get_postgres_container()
        if not container:
            print("Still no PostgreSQL container found after starting")
            return 1
    
    # Get the container IP
    container_id = container.get("ID") or container.get("id")
    if not container_id:
        print("Container ID not found")
        return 1
    
    ip_address = get_container_ip(container_id)
    if not ip_address:
        print("Container IP address not found")
        return 1
    
    print(f"PostgreSQL container is running with ID {container_id} and IP {ip_address}")
    
    # Update the database.py file with the correct IP address
    database_path = os.path.join(os.path.dirname(__file__), "database.py")
    if os.path.exists(database_path):
        with open(database_path, "r") as f:
            content = f.read()
        
        # Replace the IP address in the DATABASE_URL
        import re
        new_content = re.sub(
            r'postgresql\+asyncpg://recipe_admin:Secure_P@ssw0rd_2025!@[^/]+/copycat_recipes_db',
            f'postgresql+asyncpg://recipe_admin:Secure_P@ssw0rd_2025!@{ip_address}/copycat_recipes_db',
            content
        )
        
        if new_content != content:
            with open(database_path, "w") as f:
                f.write(new_content)
            print(f"Updated database.py with IP address {ip_address}")
        else:
            print("No changes needed to database.py")
    else:
        print(f"database.py not found at {database_path}")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
