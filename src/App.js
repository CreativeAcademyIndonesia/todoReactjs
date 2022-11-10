import './App.css';
import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

// Modal 
import Modal from 'react-bootstrap/Modal';


class App extends React.Component {
  constructor() {
    super(); 

    this.state = {
      todoname : '', 
      todolist : [],
      todolistdone : [], 
      tododone : 0, 
      todoprosess : 0, 
      status : 'ready',
    }

    this.handlerChange = this.handlerChange.bind(this);
    this.handlerUpdate  = this.handlerUpdate.bind(this)
  }

  handlerChange(e) {
    this.setState({
      todoname : e.target.value
    })
  }

  saveData() {
    if(this.state.todoname === '') {
      this.setState({
        status : 'kosong'
      })
    } else {
      let cekData = this.state.todolist.find((list) => list === this.state.todoname ); 
      if(!cekData) {
        this.setState({
          todoname : '',
          todolist : [...this.state.todolist, this.state.todoname],
          status : 'ready', 
          todoprosess : this.state.todolist.length + 1
        })
      } else {
        console.log('data sudah ada')
        this.setState({
          status : 'error'
        })
      }

    }
  }

  handlerDelete(item) {
    let newData = this.state.todolist.filter((list)=> list !== item ); 
    this.setState({
      todolist : newData,
      todoprosess : this.state.todolist.length - 1 
    })
  }

  handlerDone(item) {
    let newData = this.state.todolist.filter((list)=> list !== item ); 
    let countToDo = this.state.tododone + 1; 
    this.setState({
      todolist : newData,
      todolistdone : [this.state.todolistdone, item], 
      tododone : countToDo, 
      todoprosess : this.state.todolist.length - 1
    })
  }

  handlerUpdate(oldData, newData) {
    let data = this.state.todolist; 
    data.splice(data.indexOf(oldData), 1, newData)
    this.setState({
      todolist : data
    })

  }

  render() {
    return (
      <>
        <div className='container mt-5 py-5'>
          <div className='row justify-content-center my-3'>
            <div className='col-md-8'>
            <h1 className='fw-bold'>MY TO DO LIST</h1>
            <InputGroup className="mb-3 input-todo">
              <Form.Control
                placeholder="Masukan To Do List"
                aria-label="Masukan To Do List"
                aria-describedby="basic-addon2"
                onChange={this.handlerChange}
                value={this.state.todoname}
              />
              <Button className='btn-todo' id="button-addon2" onClick={()=> this.saveData()}>
                Save
              </Button>
            </InputGroup>
            {this.state.status === 'error'  && <Alert pesan='Data sudah ada'/>}
            {this.state.status === 'kosong'  && <Alert pesan='To Do List tidak boleh kosong'/>}
            </div>
          </div>

          <div className='row justify-content-center'>
            <Status title="To Do Done" qty={this.state.tododone}/>
            <Status title="To Do On Progress" qty={this.state.todoprosess}/>
          </div>

          <div className='row justify-content-center'>
            <div className='col-md-8'>
              { this.state.todolist.map((element, index)=> {
                  return (
                    <Listtodo 
                      key={index} 
                      tulisan={element} 
                      actionDelete={()=> this.handlerDelete(element)}
                      actionDone={()=> this.handlerDone(element)}  
                      handlerUpdate={this.handlerUpdate}
                    /> 
                  )
                })
              }
            </div>
          </div>                             
        </div>
      </>
    )
  }
}

class Status extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className='col-md-4'>
        <div className='wrapper-status'>
          <span className='fw-bold'>{this.props.title} : {this.props.qty}</span>
        </div>  
      </div>
    )
  }

}

class Listtodo extends React.Component {

  render() {
    return(
      <div className='wrapper-list d-flex justify-content-between align-items-center py-3 px-3 my-3'>
          <span>{this.props.tulisan}</span>
          <div>
            <button className='mx-1' onClick={()=> this.props.actionDone()}>
              <i className="bi bi-check-circle"></i>
            </button>

            <button className='mx-1' onClick={()=> this.props.actionDelete()} >
              <i className="bi bi-trash"></i>
            </button>

            <ModalEdit item={this.props.tulisan} handlerUpdate={this.props.handlerUpdate} />
          </div>
      </div>
    )
  }
}

function Alert(props) {
  return (
    <div className="alert alert-danger" role="alert">
      {props.pesan}
    </div>
  )
}



function ModalEdit(props) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(props.item);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const handlerChange = (e) => {
    setValue(e.target.value)
  }

  const handlerSave = () => {
    props.handlerUpdate(props.item, value);
    setShow(false)
  }

  return (
    <>

      <button className='mx-1' onClick={handleShow}>
        <i className="bi bi-pencil-square"></i>
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update data To Do</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3 input-todo">
            <Form.Control
              placeholder="Masukan To Do List"
              aria-label="Masukan To Do List"
              aria-describedby="basic-addon2"
              value={value}
              onChange={handlerChange}

            />
            <Button className='btn-todo' id="button-addon2" onClick={handlerSave}>
              Save
            </Button>
          </InputGroup>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default App;
