pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Clean Workspace') {
            steps {
                bat '''
                if exist node_modules rmdir /s /q node_modules
                if exist package-lock.json del package-lock.json
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                npm install
                npx playwright install
                '''
            }
        }

        stage('Build & Deploy Web') {
            steps {
                bat '''
                start "" /B npm start
                ping 127.0.0.1 -n 6 > nul
                '''
            }
        }

        stage('Health Check') {
            steps {
                bat 'curl http://localhost:3000'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            bat 'taskkill /F /IM node.exe || exit 0'
        }
    }
}
