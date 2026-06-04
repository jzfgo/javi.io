---
title: "sudo en Linux con Touch ID (sin morir en el intento)"
description: "Configura el agente SSH de 1Password para usar Touch ID en tu servidor Linux."
date: 2026-05-01
hero: "/blog/sudo-en-linux-con-touch-id-sin-morir-en-el-intento/0a0a3aa8-69a7-43f9-8dbb-df2ab9e4c8c5.png"
---

**TL;DR**: Con el agente SSH de 1Password, `ForwardAgent yes` en el Mac y `pam_rssh` en Linux puedes usar Touch ID para autenticarte en servidores remotos, incluyendo `sudo`.

---

Desde que cambié Windows por Linux en mi PC principal, me he dado cuenta de que, aunque es una estación de trabajo y juegos sorprendentemente capaz, cada vez la uso más como servidor que como ordenador al uso; me "conecto" a ella más de lo que me "siento" frente a ella.

De momento ya he conseguido migrar todo mi stack de IA Generativa ([ComfyUI](https://comfy.org/) y [vLLM](https://vllm.ai/)), desarrollo agéntico ([Claude Code](https://claude.com/product/claude-code)) y desarrollo más tradicional a esta máquina, aunque tengo la sensación de que apenas he rascado la superficie de lo que es posible con esta configuración.

La experiencia ha sido tremendamente **gratificante** y **constructiva**. Me ha obligado a desempolvar conocimientos de _sysadmin_ de mis tiempos gestionando servidores _bare metal_ y VPS primigenios, aprender nuevas técnicas _DevOps_ y descubrir un montón de herramientas que hacen que trabajar en la terminal sea, en muchas ocasiones, hasta más eficiente que hacerlo con aplicaciones de escritorio.

Uno de los aspectos en los que más he puesto el foco es en **reducir la fricción** al interactuar con el servidor **sin sacrificar la seguridad**. Hasta hace unos años, esto se limitaba a sustituir la autenticación por contraseña con llaves públicas. Eso ayudaba, aunque no me libraba de escribir la contraseña de turno. La aparición de los gestores de contraseñas lo hicieron algo más llevadero, pero no fue hasta la llegada de la autenticación biométrica (**Touch ID**) cuando realmente empecé a ver la luz.

Una de las funciones que más me gusta de [mi gestor de contraseñas](https://1password.com/) es el agente SSH integrado, que simplifica enormemente el uso de pares de claves de forma segura. Hasta hoy solo lo usaba para autenticarme ante servidores SSH, pero hoy algo en mi cabeza hizo clic ([supongo que de tanto actualizar](https://imgur.com/gallery/pacman-syu-H7sK5nq)) y me pregunté:

> ¿podré usar el Touch ID de mi Mac para autenticarme como root en Linux? 

Se lo pregunté a Gemini y ¡resulta que sí! Así que nos pusimos manos a la obra y, con un poco de ayuda de Claude para resolver el último escollo, lo conseguimos. Como incluso con ayuda de IA no fue exactamente trivial, he decidido documentar el proceso para quien se encuentre en la misma situación.

## Objetivo

Que al hacer `ssh` a mi Linux box (Arch, btw) desde el Mac:

- Touch ID solicite confirmación en el Mac al conectar
- El agente quede **reenviado** al servidor remoto
- `sudo` en el servidor también use Touch ID (vía el agente reenviado)

## El stack completo

![Diagrama de flujo](/blog/sudo-en-linux-con-touch-id-sin-morir-en-el-intento/flow-diagram.png)

---

## 1. Habilitar el agente SSH en 1Password

![Ajustes de 1Password Agent](/blog/sudo-en-linux-con-touch-id-sin-morir-en-el-intento/1password-agent.png)

En **1Password → Preferencias → Desarrollador**, activar:

- ✅ *Usar el agente SSH*

El socket del agente queda en:

```
~/.1password/agent.sock
```

---

## 2. Configurar `~/.ssh/config` en el Mac

```sshconfig
Host *
  IdentityAgent ~/.1password/agent.sock
  ServerAliveInterval 30

Host linux
  HostName 192.168.1.42
  User javi
  ForwardAgent yes
```

El bloque `Host *` hace que todos los hosts usen el agente de 1Password por defecto. El `ForwardAgent yes` en el host específico es lo que habilita que el agente viaje al servidor remoto.

**Fíjate** en que `ForwardAgent yes` está solo en el bloque del host `linux` y no en el _catch-all_ (`*`). Esto es así porque no es recomendable reenviar tu agente SSH a cualquier servidor, ya que si éste está comprometido, podrían utilizar tus claves para hacerse pasar por tí.

**Ojo con ControlMaster:** si tienes `ControlMaster auto` en un bloque más general que también haga match con este host, el socket de control se crea con los settings del primer match. Asegúrate de que `ForwardAgent yes` también esté en ese bloque más general, o el forwarding nunca llegará a activarse (si esto último te ha sonado a [chino wenzhounés](https://es.wikipedia.org/wiki/Chino_wenzhoun%C3%A9s), puedes obviarlo).

---

## 3. Configurar el servidor Linux

### `/etc/ssh/sshd_config.d/99-custom.conf`

```
KbdInteractiveAuthentication no
UsePAM yes
PrintMotd no
AllowAgentForwarding yes
StreamLocalBindUnlink yes
```

- `AllowAgentForwarding yes`: imprescindible para que el servidor acepte el agente reenviado
- `StreamLocalBindUnlink yes`: elimina sockets Unix obsoletos al reconectar; evita fallos si la sesión anterior no cerró limpiamente
- `KbdInteractiveAuthentication no`: deshabilita los prompts de contraseña; si usas sólo claves, es buena práctica de seguridad

### `/etc/pam.d/sudo`

```
#%PAM-1.0
auth      sufficient  pam_rssh.so
auth      include     system-auth
account   include     system-auth
session   include     system-auth
```

`pam_rssh` es lo que permite que PAM autentique usando el agente SSH reenviado. Con `sufficient`, si el agente responde correctamente, lo que en la práctica significa que Touch ID se confirma en el Mac, no se pide contraseña. Está disponible en el AUR:

```bash
paru -S pam_rssh
```

### `/etc/sudoers` (vía `visudo`)

```
Defaults env_keep += "SSH_AUTH_SOCK"
```

Por defecto `sudo` limpia las variables de entorno, así que `SSH_AUTH_SOCK` desaparecería antes de que `pam_rssh` pudiera leerla. Esta línea la preserva.

---

## 4. El error tonto

Después de configurar todo lo anterior, el _agent forwarding_ seguía sin funcionar. `$SSH_AUTH_SOCK` en el servidor apuntaba a `/run/user/1000/ssh-agent.socket` (un socket inexistente) en lugar del socket reenviado real.

Fui descartando causas una a una:

```bash
# ¿Hay algún servicio de systemd interfiriendo?
systemctl --user status ssh-agent.socket
# → disabled and dead ✓

# ¿Tiene la variable hardcodeada en el entorno de systemd?
systemctl --user show-environment | grep SSH
# → nada ✓

# ¿Está en la config del shell?
grep -r SSH_AUTH_SOCK ~/.zshrc ~/.zprofile ~/.zlogin ~/.zshenv
# → /home/javi/.zshenv: export SSH_AUTH_SOCK="$XDG_RUNTIME_DIR/ssh-agent.socket"
```

Ahí estaba. Una línea en `.zshenv` sobreescribía `SSH_AUTH_SOCK` **siempre**, incluso después de que SSH lo hubiera configurado correctamente. Como `.zshenv` se carga en todos los contextos de zsh (interactivo, no interactivo, login, no login), ganaba siempre y sin avisar.

![Infinite facepalm](/blog/sudo-en-linux-con-touch-id-sin-morir-en-el-intento/facepalm-react.gif)

La solución fue simplemente eliminar esa línea. La había añadido en algún momento para un agente systemd que ya no uso y se me había olvidado por completo. A ti probablemente no te pasará exactamente esto, pero si el forwarding no funciona, lo primero que deberías revisar es si algo en tu shell config está pisando esa variable.

---

## 5. Verificación

Después de reconectar:

```bash
echo $SSH_AUTH_SOCK
# /home/javi/.ssh/agent/s.uRkD2K0GuL.sshd.3m8Qqcp00S  ✓

ssh-add -l
# 256 SHA256:xxxx... javi@mac (ED25519)  ✓

sudo ls /root
# → Touch ID prompt en el Mac ✓
```

---

## Resumen de archivos modificados

| Archivo | Qué hace |
|---|---|
| Mac: `~/.ssh/config` | Apunta al socket de 1Password, habilita ForwardAgent |
| Linux: `sshd_config.d/` | Habilita AllowAgentForwarding |
| Linux: `/etc/pam.d/sudo` | Usa pam_rssh para autenticar con el agente |
| Linux: `/etc/sudoers` | Preserva SSH_AUTH_SOCK al invocar sudo |
| Linux: `~/.zshenv` | **Eliminar** cualquier export de SSH_AUTH_SOCK |

---

## Conclusión

El proceso en sí no es especialmente complicado, pero tiene bastantes puntos donde puede romperse en silencio. La configuración puede ser correcta al cien por cien y aun así no funcionar por algo completamente ajeno a ella, como una variable de entorno sobreescrita en el shell. Eso es lo que hace que este tipo de debugging sea tan frustrante y también tan satisfactorio cuando finalmente encaja.

Si lo estás configurando y no consigues que funcione, empieza por lo básico: comprueba que `$SSH_AUTH_SOCK` en el servidor apunta a algo real y que ningún archivo de configuración del shell lo está pisando. A partir de ahí, el resto suele ser mucho más directo.

Y si llegas al punto en que Touch ID en el Mac desbloquea un `sudo` en tu servidor Linux, reconoce un momento el logro **porque mola bastante**.
