FROM nginx:alpine
COPY ./dist/chatbot /usr/share/nginx/html
EXPOSE 80

