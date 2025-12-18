# Configuração das Regras do Firestore

## ⚠️ Importante: Deploy das Regras Necessário

As regras do Firestore foram atualizadas no arquivo `.firestore-rules.txt`, mas **você precisa fazer o deploy delas no Firebase Console** para que funcionem.

## 📋 Como Fazer o Deploy das Regras

### Opção 1: Firebase Console (Web)

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto `taverna-rpg-store`
3. No menu lateral, clique em **Firestore Database**
4. Clique na aba **Rules** (Regras)
5. Cole o conteúdo do arquivo `.firestore-rules.txt`
6. Clique em **Publish** (Publicar)

### Opção 2: Firebase CLI (Terminal)

Se você tem o Firebase CLI instalado:

```bash
# Instalar Firebase CLI (se não tiver)
npm install -g firebase-tools

# Fazer login
firebase login

# Inicializar (se ainda não fez)
firebase init firestore

# Deploy das regras
firebase deploy --only firestore:rules
```

### Opção 3: Copiar e Colar

1. Abra o arquivo `.firestore-rules.txt` neste projeto
2. Copie todo o conteúdo
3. Cole no Firebase Console > Firestore Database > Rules
4. Clique em **Publish**

## 🔒 O que as Regras Fazem

As regras configuradas permitem:

### ✅ Usuários Autenticados Podem:
- Criar seu próprio documento em `users/{userId}`
- Ler seu próprio documento de usuário
- Atualizar seu próprio documento de usuário
- Deletar seu próprio documento de usuário
- Gerenciar suas subcoleções (favoritos, compras, etc.)

### ✅ Favoritos (`/favorites`):
- Qualquer usuário autenticado pode criar favoritos
- Usuários só podem ler/atualizar/deletar seus próprios favoritos

### ✅ Compras (`/purchases`):
- Usuários só podem ler suas próprias compras
- Usuários só podem criar compras para si mesmos

### ✅ Avaliações (`/reviews`):
- Qualquer um pode ler avaliações (públicas)
- Usuários autenticados podem criar avaliações
- Usuários só podem atualizar/deletar suas próprias avaliações

### ❌ Bloqueado:
- Qualquer outra collection que não esteja especificada nas regras

## 🧪 Testar as Regras

Após fazer o deploy, teste:

1. **Login com Google:**
   - Clique em "Entrar" > "Continuar com Google"
   - O login deve funcionar sem erros de permissão
   - O documento do usuário deve ser criado automaticamente em `users/{uid}`

2. **Login com Email/Senha:**
   - Crie uma conta ou faça login
   - O documento do usuário deve ser criado/atualizado

3. **Verificar no Firebase Console:**
   - Vá em Firestore Database > Data
   - Deve aparecer uma collection `users` com documentos

## 🐛 Solução de Problemas

### Erro: "Missing or insufficient permissions"

**Causa:** As regras não foram deployadas ainda ou estão incorretas.

**Solução:**
1. Verifique se fez o deploy das regras no Firebase Console
2. Verifique se as regras estão corretas (copie do `.firestore-rules.txt`)
3. Aguarde alguns segundos após publicar (pode levar até 1 minuto para propagar)

### Erro: "Cross-Origin-Opener-Policy"

**Causa:** Este é apenas um warning do Firebase, não um erro real. O Firebase tenta detectar se o popup foi fechado, mas alguns navegadores bloqueiam isso.

**Solução:** Este warning pode ser ignorado. O login ainda deve funcionar. Se não funcionar, verifique as regras do Firestore.

### Erro: "Popup bloqueado"

**Causa:** O navegador está bloqueando popups.

**Solução:**
1. Permita popups para `localhost` ou seu domínio
2. Ou use `signInWithRedirect` ao invés de `signInWithPopup` (requer mudança no código)

## 📝 Conteúdo das Regras Atuais

As regras estão no arquivo `.firestore-rules.txt` e incluem:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Usuários podem gerenciar seus próprios documentos
    match /users/{userId} {
      allow read, create, update, delete: 
        if request.auth != null && request.auth.uid == userId;
      
      // Subcoleções também protegidas
      match /{subcollection=**} {
        allow read, write: 
          if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // ... outras regras para favoritos, compras, avaliações
  }
}
```

## ✅ Após o Deploy

Após fazer o deploy das regras:
1. O login com Google deve funcionar perfeitamente
2. O login com Email/Senha deve funcionar perfeitamente
3. Os documentos dos usuários serão criados automaticamente
4. Não haverá mais erros de "Missing or insufficient permissions"

## 🔗 Links Úteis

- [Firebase Console](https://console.firebase.google.com/)
- [Documentação Firebase Firestore Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)

