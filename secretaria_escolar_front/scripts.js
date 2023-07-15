/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de alunos cadastrados existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/listagem_alunos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.alunos.forEach(item => insertList(item.num_matricula, item.nome_aluno, item.turma_aluno, item.nome_responsavel, item.cpf_responsavel, item.tel_responsavel))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos alunos já cadastrados
  --------------------------------------------------------------------------------------
*/
getList()

const getAluno = async () => {
  var matricula = document.getElementById("pesqNumMatricula").value;
  var ExisteNumMatricula = ExisteMatricula(matricula);
  if (matricula === '' || matricula.length < 6){
    alert("Escreva o número de matrícula do aluno com 6 dígitos");
  } 
  else if (ExisteNumMatricula === false) {
    alert("Matricula não cadastrada!");
  } 
  else {
  let url = 'http://127.0.0.1:5000/busca_aluno?num_matricula=' + matricula;
  fetch(url, {
    method: 'get'
  })
    .then((response) => response.json())
    .then((data) => {
        insertAlunoPesquisa(data.num_matricula, data.nome_aluno, data.turma_aluno, data.nome_responsavel, data.cpf_responsavel, data.tel_responsavel)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir um aluno na base de dados do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputNumMatricula, inputNomeAluno, inputTurmaAluno, inputNomeResponsavel, inputCPFResponsavel, inputTelResponsavel) => {
  const formData = new FormData();
  formData.append('num_matricula', inputNumMatricula);
  formData.append('nome_aluno', inputNomeAluno);
  formData.append('turma_aluno', inputTurmaAluno);
  formData.append('nome_responsavel', inputNomeResponsavel);
  formData.append('cpf_responsavel',inputCPFResponsavel);
  formData.append('tel_responsavel',inputTelResponsavel)

  let url = 'http://127.0.0.1:5000/cadastra_aluno';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada aluno da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um aluno da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza que quer remover esse aluno do cadastro?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Aluno removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um aluno da base de dados do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/remove_aluno?num_matricula=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  ------------------------------------------------------------------------------------------------------------------------------------------------
  Função para cadastrar um novo aluno com os seguintes dados: do aluno (número de matrícula, nome e turma) e do responsável (nome, cpf e telefone)
  ------------------------------------------------------------------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputNumMatricula = document.getElementById("newNumMatricula").value;
  let inputNomeAluno = document.getElementById("newNomeAluno").value;
  let inputTurmaAluno = document.getElementById("newTurmaAluno").value;
  let inputNomeResponsavel = document.getElementById("newNomeResponsavel").value;
  let inputCPFResponsavel = document.getElementById("newCPFResponsavel").value;
  let inputTelResponsavel = document.getElementById("newTelResponsavel").value;

  if (inputNumMatricula === '' || inputNumMatricula.length < 6) {
    alert("Escreva o número de matrícula do aluno com 6 dígitos");
  } else if (inputNomeAluno === '' || inputTurmaAluno === '' || inputNomeResponsavel === '' || inputCPFResponsavel === '' || inputTelResponsavel == '') {
    alert("Escreva as outras informações do aluno");
  } else {
    insertList(inputNumMatricula, inputNomeAluno, inputTurmaAluno, inputNomeResponsavel, inputCPFResponsavel, inputTelResponsavel)
    postItem(inputNumMatricula, inputNomeAluno, inputTurmaAluno, inputNomeResponsavel, inputCPFResponsavel, inputTelResponsavel)
    alert("Aluno cadastrado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir alunos na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (num_matricula, nome_aluno, turma_aluno, nome_responsavel, cpf_responsavel, tel_responsavel) => {
  var item = [num_matricula, nome_aluno, turma_aluno, nome_responsavel, cpf_responsavel, tel_responsavel]
  var table = document.getElementById('tblListAlunos');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newNumMatricula").value = "";
  document.getElementById("newNomeAluno").value = "";
  document.getElementById("newTurmaAluno").value = "";
  document.getElementById("newNomeResponsavel").value = "";
  document.getElementById("newCPFResponsavel").value = "";
  document.getElementById("newTelResponsavel").value = "";

  removeElement()
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir o aluno pesquisado numa lista individual com apenas o aluno pesquisado
  --------------------------------------------------------------------------------------
*/

const insertAlunoPesquisa = (num_matricula, nome_aluno, turma_aluno, nome_responsavel, cpf_responsavel, tel_responsavel) => {
  var item = [num_matricula, nome_aluno, turma_aluno, nome_responsavel, cpf_responsavel, tel_responsavel]
  var table = document.getElementById('tblPesquisa');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  document.getElementById("pesqNumMatricula").value = "";
}

/*
  --------------------------------------------------------------------------------------
  Função que verifica a existência de uma matricula na listagem de alunos cadastrados
  --------------------------------------------------------------------------------------
*/

function ExisteMatricula(matricula) {
  var table = document.getElementById("tblListAlunos");
  for (var i = 2; i < table.childNodes[1].childNodes.length; i++) {
    var rowTable = table.childNodes[1].childNodes[i].textContent;
    if (rowTable.indexOf(matricula) === 0) {
      return true;
    }
  }
  return false;
}

/*
  --------------------------------------------------------------------------------------
  Função para remover o aluno pesquisado da lista individual do aluno pesquisado
  --------------------------------------------------------------------------------------
*/

const LimpaListPesquisa = () => {
  var table = document.getElementById("tblPesquisa");
  table.childNodes[1].childNodes[2].remove();
}