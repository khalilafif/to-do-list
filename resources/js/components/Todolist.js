import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label} from 'reactstrap';
import axios from 'axios';
export default class Todolist extends Component {
    constructor(){
        super();
        this.state = {
            tasks: [],
            newTaskModal: false,                       
            detailTaskModal:false,
            deleteTaskModal:false,
            deleteTaskId: "",
            newTaskData: {
                title: "" ,
                state: "",
                detail: ""
            },
            ediTaskData: {
                title: "" ,
                state: "",
                detail: ""
            },
            errors: {}
        }
    }
    loadTasks(){
        axios.get('/api/task',{
			headers: { 'Authorization': 'Bearer ' + this.props.token }
		}).then((response) =>{
            this.setState({
                tasks: response.data.data,                 
                
            })
        
				
        })
    }
    editTask(id){
        axios.get('/api/task/edit/'+id,{
			headers: { 'Authorization': 'Bearer ' + this.props.token }
		}).then((response) =>{
            console.log('sdvbs',response);
            this.setState({
                detailTaskModal:true,
                ediTaskData: {
                   title: response.data.data.title ,
                   state: response.data.data.state,
                   detail: response.data.data.detail 
                }              
            })
        })
    }
    deleteTask(){
        axios.get('/api/task/delete/'+this.state.deleteTaskId,{
			headers: { 'Authorization': 'Bearer ' + this.props.token }
		}).then((response) =>{
            this.loadTasks();
            this.setState({
                deleteTaskModal:false,
                deleteTaskId: ""                             
            })
        })
    }
    addTask(){
        if(this.formValidation()){
            axios.post('/api/task/store', this.state.newTaskData,{
                headers: { 'Authorization': 'Bearer ' + this.props.token }
            }).then((response) =>{
                this.loadTasks();
                this.setState({
                    newTaskModal:false,
                    newTaskData: {
                    title: "" ,
                    state: "",
                    detail: ""
                    },
                    errors: {}
                })
            })
        }
    }
    updateTask(id,state){
        let taskToUpdate = {
            id: id,
            state: state
        }
        axios.post('/api/task/update', taskToUpdate,{
			headers: { 'Authorization': 'Bearer ' + this.props.token }
		}).then((response) =>{
            this.loadTasks();
            console.log("update with success");
        })
    }
    formValidation(){
        let fields = this.state.newTaskData;
        let errors = {};
        let formIsValid = true;
        if(!fields.title){
            formIsValid = false;
            errors["title"] = "Title Cannot be empty";
         }
        if(!fields.state){
            formIsValid = false;
            errors["state"] = "State Cannot be empty";
         }
        if(!fields.detail){
            formIsValid = false;
            errors["detail"] = "Detail Cannot be empty";
         }
         this.setState({errors: errors});
         return formIsValid
    }
    closeModals(){
        this.setState({
            newTaskModal: false,
            detailTaskModal: false,
            deleteTaskModal: false,
        })
    }
    btnDeleteTask(id){
        this.setState({
            deleteTaskModal: true,
            deleteTaskId: id
        })
    }
    openNewTaskModal(){
        this.setState({
            newTaskModal: true
        })
    }
    openDetailTaskModal(){
        this.setState({
            detailTaskModal: true
        })
    }
    openDeleteTaskModal(){
        this.setState({
            deleteTaskModal: true
        })
    }
    componentWillMount(){
        this.loadTasks();
    }
    render() {
        let tasks= this.state.tasks.map((task,index) => {
            return (
                <tr key={task._id}>
                    <td>{index+1}</td>
                    <td>{task.title}</td>
                    <td>
                    <Input type="select" name="nState"
                     value={task.state}
                     onChange={(e)=>{
                        this.updateTask(task._id,e.target.value)
                     }}>
                        <option value="Not Completed">Not Completed</option>
                        <option value="completed">Completed</option>                        
                    </Input>
                    </td>
                    <td>
                        <Button color="primary" onClick={() => this.editTask(task._id)}>Detail</Button>{' '}
                        <Button color="danger" onClick={() => this.btnDeleteTask(task._id)}>Delete</Button>
                    </td>
                </tr>
            )
        });
        return (
        <div className="container">            
            <Button color="success" onClick={this.openNewTaskModal.bind(this)}>Add new task</Button>
            <Modal isOpen={this.state.newTaskModal} toggle={this.openNewTaskModal.bind(this)} >
            <ModalHeader toggle={this.openNewTaskModal.bind(this)}>Add new task</ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input type="text" name="nTitle" id="title"
                     value={this.state.newTaskData.title}
                     onChange={(e)=>{
                         let {newTaskData} = this.state;
                         newTaskData.title= e.target.value;
                         this.setState({newTaskData});
                     }}/>
                     <span style={{color: "red"}}>{this.state.errors["title"]}</span>
                </FormGroup>
                <FormGroup>
                    <Label for="state">State</Label>
                    <Input type="select" name="nState" id="state"
                     value={this.state.newTaskData.state}
                     onChange={(e)=>{
                         let {newTaskData} = this.state;
                         newTaskData.state= e.target.value;
                         this.setState({newTaskData});
                     }}>
                         <option></option>
                        <option value="Not Completed">Not Completed</option>
                        <option value="Competed">Competed</option>                        
                    </Input>
                    <span style={{color: "red"}}>{this.state.errors["state"]}</span>
                </FormGroup>
                <FormGroup>
                <Label for="detail">Detail</Label>
                <Input type="textarea" name="nDetail" id="detail"
                 value={this.state.newTaskData.detail}
                 onChange={(e)=>{
                     let {newTaskData} = this.state;
                     newTaskData.detail= e.target.value;
                     this.setState({newTaskData});
                 }} />
                 <span style={{color: "red"}}>{this.state.errors["detail"]}</span>
            </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={this.addTask.bind(this)}>Save</Button>{' '}
                <Button color="secondary" onClick={this.closeModals.bind(this)}>Cancel</Button>
            </ModalFooter>
            </Modal>
            
            <Modal isOpen={this.state.detailTaskModal} toggle={this.openDetailTaskModal.bind(this)} >
            <ModalHeader toggle={this.openDetailTaskModal.bind(this)}>Detail task</ModalHeader>
            <ModalBody>
                <p><strong>Title: </strong> {this.state.ediTaskData.title}</p>
                <p><strong>State: </strong> {this.state.ediTaskData.state}</p>
                <p><strong>Detail: </strong> {this.state.ediTaskData.detail}</p>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={this.closeModals.bind(this)}>Cancel</Button>
            </ModalFooter>
            </Modal>
            
            <Modal isOpen={this.state.deleteTaskModal} toggle={this.openDeleteTaskModal.bind(this)} >
            <ModalHeader toggle={this.openDeleteTaskModal.bind(this)}>Delete task</ModalHeader>
            <ModalBody>
                Are you sure !
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={this.deleteTask.bind(this)}>Sure</Button>
            </ModalFooter>
            </Modal>

            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>State</th>
                        <th>Action</th>
                    </tr>        
                </thead>
                <tbody>
                    {tasks}
                </tbody>
            </Table>
        </div>);
    }
}



if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
