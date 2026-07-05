#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;

    std::string name;
    std::cout << "What's your name? ";
    std::getline(std::cin, name);

    std::cout << "Nice to meet you, " << name << "!" << std::endl;

    return 0;
}
