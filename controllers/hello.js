class HelloController {
  static getHelloMessage = (request, response, next) => {
    response.write("Good Morning!");
    return response.end();
  }
}

module.exports = HelloController;