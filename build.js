function node(element,leftchild,rightchild){
    this.leftchild=leftchild;
    this.rightchild=rightchild;
    this.element=element;
    this.x=0;
    this.y=0;
    this.width=0;
}

function build_tree(root_element,left_element,right_element){
    var root=new node(root_element,null,null);
    if(left_element==null){
        root.leftchild=null;
    }
    else if (left_element.indexOf('[')==-1){
        root.leftchild=new node(left_element,null,null);
    }
    else{
        var a=find_subtree(left_element);
        var l_left,l_right;
        var l_root=left_element.substring(0,a[0]);
        if(a[0]+1==a[1]){
            l_left=null;
        }
        else{
            l_left=left_element.substring(a[0]+1,a[1]);
        }
        
        if(a[1]+2==left_element.length-1){
            l_right=null;
        }
        else{
            l_right=left_element.substring(a[1]+2,left_element.length-1);//a[][a]
        }
        
        root.leftchild= build_tree(l_root,l_left,l_right);
    }

    if(right_element==null){
        root.rightchild=null;
    }
    else if (right_element.indexOf('[')==-1){
        right_element=right_element.substring(0,right_element.length);
        root.rightchild=new node(right_element,null,null);
    }
    else{
        var a=find_subtree(right_element);
        var r_left,r_right;
        var r_root=right_element.substring(0,a[0]);
        
        if(a[0]+1==a[1]){
            r_left=null;
        }   
        else{
            r_left=right_element.substring(a[0]+1,a[1]);
        }  
        
        if(a[1]+2==right_element.length-1){
            r_right=null;
        }   
        else{
            r_right=right_element.substring(a[1]+2,right_element.length-1);
        }
        
        root.rightchild= build_tree(r_root,r_left,r_right);
    }
    return root;
}

function find_subtree(s){
    var a=new Array();
    a[0]=s.indexOf('[');
    var i=a[0]+1;
    var flag=1;
    while(true){
        if(s[i]=='[')
            flag+=1;
        if(s[i]==']')
           flag-=1;
        if(flag==0)
            break;
        i+=1;
    }
    a[1]=i;
    return a;
}

function find_level(root){
    var l_level,r_level;
    if(root.leftchild==null)
        l_level=0;
    else
        l_level=find_level(root.leftchild);
    
    if(root.rightchild==null)
        r_level=0;
    else
        r_level=find_level(root.rightchild);
    
    return Math.max(l_level,r_level)+1;
}

function find_coordinate(root){
    var level=find_level(root);
    max_width=Math.pow(2,level-1)*30;
    queue = [];
    root.x=max_width/2;
    root.y=20;
    root.width=max_width;
    
    queue.push(root);
    while(queue.length){
        var a=queue.shift();
        if(a.leftchild!=null){
            a.leftchild.x=a.x-a.width/4;
            a.leftchild.y=a.y+20+3*(a.element.length+a.leftchild.element.length);
            a.leftchild.width=a.width/2;
            queue.push(a.leftchild);
        }
        if(a.rightchild!=null){
            a.rightchild.x=a.x+a.width/4;
            a.rightchild.y=a.y+20+3*(a.element.length+a.leftchild.element.length);
            a.rightchild.width=a.width/2;
            queue.push(a.rightchild);
        }
    }
}

function draw_node(ctx,root){
    var r=7;
    var rate=3;
    ctx.beginPath();
    ctx.strokeStyle = "#005588";
    ctx.arc(root.x, root.y, r+root.element.length*rate, 0, Math.PI*2, true);
    ctx.stroke();
    ctx.fillText(root.element, root.x-2.2*root.element.length, root.y+1.8*root.element.length);


    
    if(root.leftchild!=null){
        ctx.beginPath();
        ctx.moveTo(root.x,root.y+root.element.length*rate+r);
        ctx.lineTo(root.leftchild.x,root.leftchild.y-(root.leftchild.element.length*rate+r));
        ctx.stroke();
        draw_node(ctx,root.leftchild);
    }
    
    if(root.rightchild!=null){
        ctx.beginPath();
        ctx.moveTo(root.x,root.y+root.element.length*rate+r);
        ctx.lineTo(root.rightchild.x,root.rightchild.y-(root.rightchild.element.length*rate+r));
        ctx.stroke();
        draw_node(ctx,root.rightchild);
    }
}

function draw_tree(s){
    var a=find_subtree(s);
    var root_element=s.substring(0,a[0]);
    var l_element=s.substring(a[0]+1,a[1]);//a[][]
    var r_element=s.substring(a[1]+2,s.length-1);//a[][]
    
    var root=build_tree(root_element,l_element,r_element);
    console.log(root);
    find_coordinate(root);
    
    var canvas=document.getElementById("Canvas");
    var ctx=canvas.getContext("2d");
    ctx.beginPath();
    draw_node(ctx,root);
}