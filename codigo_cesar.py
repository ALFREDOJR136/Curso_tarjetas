abecedario = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")


def cifrar_mensaje(mensaje: str, desplazamiento: int = 3) -> str:
    mensaje = mensaje.upper()
    mensaje = list(mensaje)
    largo_mensaje = len(mensaje)

    while largo_mensaje > 0:
        largo_mensaje = largo_mensaje - 1

        if mensaje[largo_mensaje] in abecedario:
            indice = abecedario.index(mensaje[largo_mensaje])
            nuevo_indice = (indice + desplazamiento) % len(abecedario)
            mensaje[largo_mensaje] = abecedario[nuevo_indice]

    return "".join(mensaje)


def descifrar_mensaje(mensaje: str, desplazamiento: int = 3) -> str:
    mensaje = mensaje.upper()
    mensaje = list(mensaje)
    largo_mensaje = len(mensaje)

    while largo_mensaje > 0:
        largo_mensaje = largo_mensaje - 1

        if mensaje[largo_mensaje] in abecedario:
            indice = abecedario.index(mensaje[largo_mensaje])
            nuevo_indice = (indice - desplazamiento) % len(abecedario)
            mensaje[largo_mensaje] = abecedario[nuevo_indice]

    return "".join(mensaje)


if __name__ == "__main__":
    # pedir mensaje al usuario
    mensaje = input("Introduce el mensaje a cifrar: ")

    # pedir desplazamiento y validar entero
    while True:
        s = input("Introduce el codigo: ")
        try:
            desplazamiento = int(s)
            break
        except ValueError:
            print("Entrada no válida. Introduce un número entero (puede ser negativo).")

    mensaje_cifrado = cifrar_mensaje(mensaje, desplazamiento)
    print("Mensaje cifrado:", mensaje_cifrado)

    mensaje_descifrado = descifrar_mensaje(mensaje_cifrado, desplazamiento)
    print("Mensaje descifrado:", mensaje_descifrado)
