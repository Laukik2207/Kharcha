pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/Laukik2207/Kharcha.git'
            }
        }

        stage('Frontend Install') {
            steps {
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
        }

        stage('Backend Install') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Backend Validation') {
            steps {
                dir('server') {
                    sh 'npm run start'
                }
            }
        }
    }

    post {
        success {
            echo 'Kharcha pipeline executed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}