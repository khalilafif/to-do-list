<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Task;
use Validator;
class TaskController extends Controller
{
   
    public function __construct() {
    }

    public function index(){
        $tasks= Task::all();
        return response()->json(['status'=>true,'message'=>'Tasks list','data'=>$tasks]);
    }

    public function store(Request $request){
        
        $this->validate($request,[
            'title'=>'required',
            'state'=>'required',
            'detail'=>'required'
        ]);
     
        $task= Task::create([
            'title' => $request->title,
            'state' => $request->state,
            'detail' => $request->detail
        ]);

        return response()->json(['status'=>true,'message'=>'Task created successfully','data'=>$task]);
    }

    public function update(Request $request){
        $this->validate($request,[
            'id'=>'required',
            //'title'=>'required',
            'state'=>'required',
            //'detail'=>'required'
        ]);
    	$task = Task::findOrFail($request->id)->update([ 
           // 'title' => $request->title,
            'state' => $request->state,
           // 'detail' => $request->detail
        ]);
    	return response()->json(['status'=>true,'message'=>'Task updated successfully','data'=>$task]);
    }

     public function edit($id){
        $task= Task::findOrFail($id);
        return response()->json(['status'=>true,'message'=>'Task shown ','data'=>$task]);
    }
     public function delete($id){
        $task= Task::findOrFail($id)->delete();
        return response()->json(['status'=>true,'message'=>'Task has been deleted']);
    }
}
