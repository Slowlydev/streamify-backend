terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 4.16"
        }
    }
    required_version = ">= 1.2.0"
}

provider "aws" {
    region = "us-east-1"
}

resource "aws_vpc" "backend-server" {
    cidr_block = "10.0.0.0/16"
    enable_dns_hostnames = true
    enable_dns_support = true
}

resource "aws_internet_gateway" "backend-server" {
    vpc_id = aws_vpc.backend-server.id
}

resource "aws_route" "internet_access" {
    route_table_id = aws_vpc.backend-server.main_route_table_id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.backend-server.id
}

resource "aws_subnet" "backend-server-intern" {
    cidr_block = "10.0.1.0/24"
    map_public_ip_on_launch = false
    vpc_id = aws_vpc.backend-server.id 
}

resource "aws_security_group" "backend-server" {
    name = "backend-server"
    vpc_id = aws_vpc.backend-server.id
    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        from_port = 4000
        to_port = 4000
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    # outbound internet access alles erlaubt
    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

variable "public_key" {
  type = string
}

resource "aws_key_pair" "deployer" {
    key_name = "deployer-key"
    public_key = var.public_key
}

resource "aws_instance" "backend-server" {
    ami = "ami-083654bd07b5da81d"
    instance_type = "t2.micro"
    associate_public_ip_address = true
    vpc_security_group_ids = [aws_security_group.backend-server.id]
    subnet_id = aws_subnet.backend-server-intern.id
    key_name = aws_key_pair.deployer.key_name
    tags = {
        Name = "backend-server"
    }
}
