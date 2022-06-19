var s = new sigma({
    renderer: {
        container: document.getElementById("sigma_practice"),
        type: "canvas",
    },
    settings: {
        maxEdgeSize: 5,
        maxNodeSize: 15,
    },
});

var graph_new = {
    nodes: [],
    edges: []
};

var nodes_arr = [];

var nodes_xy = [];

var nodes_flow = [];

var steps = [];

var back_steps = [];

var step_ind = -1;

var edges_dict = new Map();

var node_dict = new Map();

var node_to_num = new Map();

var h = [];

var so = "";

var t = "";

var flow = 0;

var num = 0;

const SCALE = 2;


s.graph.read(graph_new);
let dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
s.refresh();

function add_node() {
    let node_name = document.getElementById("node_name");
    if (node_name.value == "") {
        alert("Node name is not specified");
        return;
    }
    s.graph.addNode({
        id: node_name.value,
        label: node_name.value,
        x: 1,
        y: 1,
        size: 15,
        color: '#FFFF00' //EE651D
    });
    nodes_arr.push(node_name.value);
    let str = '<option value="'+ node_name.value + '" />';
    let my_list = document.getElementById("node_data");
    my_list.innerHTML += str;
    s.refresh();
}

function example_graph() {
    num = 1;
    clear_all();
    num = 0;
    let graph = {
        nodes: [
            {
                id:  '0',
                label: '0',
                x: 1,
                y: 1,
                size: 15,
                color: '#FFFF00'
            },
            {
                id:  '1',
                label: '1',
                x: 2,
                y: 0,
                size: 15,
                color: '#FFFF00'
            },
            {
                id:  '2',
                label: '2',
                x: 2,
                y: 2,
                size: 15,
                color: '#FFFF00'
            },
            {
                id:  '3',
                label: '3',
                x: 3,
                y: 1,
                size: 15,
                color: '#FFFF00'
            },
        ],
        edges: [
            {
                id: "0 1", 
                source: '0', 
                target: '1',
                color: '#ADD8E6',
                type: 'arrow',
                size: 0.5,
                label: '0 / 2',
                capacity: 2,
                curr: 0,
            },
            {
                id: "1 3", 
                source: '1', 
                target: '3',
                color: '#ADD8E6',
                type: 'arrow',
                size: 0.5,
                label: '0 / 1',
                capacity: 1,
                curr: 0,
            },
            {
                id: "0 2", 
                source: '0', 
                target: '2',
                color: '#ADD8E6',
                type: 'arrow',
                size: 0.5,
                label: '0 / 4',
                capacity: 4,
                curr: 0,
            },
            {
                id: "2 3", 
                source: '2', 
                target: '3',
                color: '#ADD8E6',
                type: 'arrow',
                size: 0.5,
                label: '0 / 5',
                capacity: 5,
                curr: 0,
            },
            {
                id: "1 2", 
                source: '1', 
                target: '2',
                color: '#ADD8E6',
                type: 'arrow',
                size: 0.5,
                label: '0 / 3',
                capacity: 3,
                curr: 0,
            },
        ],
    };
    s.graph.read(graph);
    let str = '';
    for (let i = 0; i < 4; ++i) {
        str += '<option value="'+ i.toString() + '" />';
    }
    let my_list = document.getElementById("node_data");
    my_list.innerHTML += str;
    nodes_arr = ['0', '1', '2', '3'];
    edges_dict.set('0 1', 0);
    edges_dict.set('1 3', 1);
    edges_dict.set('0 2', 2);
    edges_dict.set('2 3', 3);
    edges_dict.set('1 2', 4);
    s.refresh();
}

function add_edge() {
    let start = document.getElementById("start_node").value;
    let end = document.getElementById("end_node").value;
    let capacity = document.getElementById("capacity").value;
    if (capacity == "" || end == "" || start == "") {
        alert("You should fill all three fields");
    }
    s.graph.addEdge({
        id: start + ' ' + end,
        source: start,
        target: end,
        type: "arrow",
        size: Math.floor(capacity),
        label: '0 / ' + capacity,
        capacity: Math.floor(capacity),
        curr: 0,
        color: '#ADD8E6',
    });
    edges_dict.set(start + ' ' + end, s.graph.edges().length - 1);
    s.refresh();
}

function clear_all() {
    s.graph.clear();
    s.refresh();
    let my_list = document.getElementById("node_data");
    my_list.innerHTML = '';
    nodes_arr = [];
    edges_dict.clear();
    node_dict.clear();
    node_to_num.clear();
    steps = [];
    step_ind = -1;
    back_steps = [];
    let h_text = document.getElementById("h_arr");
    let h_text1 = document.getElementById("h_arr1");
    h_text.innerHTML = 'h = { }';
    h_text1.innerHTML = '';
    so = "";
    t = "";
    flow = 0;
    if (num == 0)
        alert("Canvas has been cleared");
    return;

}

function push_relabel() {
    for (let i = 0; i < nodes_arr.length; ++i) {
        nodes_xy.push([s.graph.nodes()[i].x, s.graph.nodes()[i].y]);
    }
    console.log(edges_dict);
    so = document.getElementById("source_node").value;
    t = document.getElementById("target_node").value;
    let n = nodes_arr.length;
    for (let i = 0; i < n; ++i) {
        node_dict.set(i, nodes_arr[i]);
        node_to_num.set(nodes_arr[i], i);
    }
    let c = new Array(n);
    let f = new Array(n);
    h = new Array(n);
    nodes_flow = new Array(n);
    let e = new Array(n);
    let maxh = new Array(n);
    let sz = 0;
    for (let i = 0; i < n; ++i) {
        c[i] = new Array(n);
        f[i] = new Array(n);
        h[i] = 0;
        e[i] = 0;
        nodes_flow[i] = 0;
        maxh[i] = n;
        for (let j = 0; j < n; ++j) {
            c[i][j] = 0;
            f[i][j] = 0;
        }
    }
    h[node_to_num.get(so)] = n - 1;
    steps.push([-1, -1, node_to_num.get(so), node_to_num.get(so), -n + 1, h.slice(), -1]);
    for (let i = 0; i < s.graph.edges().length; ++i) {
        elem = s.graph.edges()[i];
        c[node_to_num.get(elem.source)][node_to_num.get(elem.target)] = elem.capacity;
    }

    for (let i = 0; i < n; ++i) {
		f[node_to_num.get(so)][i] = c[node_to_num.get(so)][i];
		f[i][node_to_num.get(so)] = -f[node_to_num.get(so)][i];
        if (c[node_to_num.get(so)][i] != 0) {
            steps.push([edges_dict.get(so + ' ' + node_dict.get(i)), f[node_to_num.get(so)][i], -1, -1, -1, h.slice(), c[node_to_num.get(so)][i]]);
        }
		e[i] = c[node_to_num.get(so)][i];
	}
    for (;;) {
		if (!sz) {
			for (let i=0; i<n; ++i) {
				if (i != node_to_num.get(so) && i != node_to_num.get(t) && e[i] > 0) {
					if (sz && h[i] > h[maxh[0]]) {
						sz = 0;
                    }
					if (!sz || h[i] == h[maxh[0]]) {
						maxh[sz++] = i;
                    }
				}
            }
        }
		if (!sz) { 
            break;
        }
		while (sz) {
            console.log(maxh);
			let i = maxh[sz-1];
			let pushed = false;
			for (let j=0; j<n && e[i]; ++j) {
				if (c[i][j]-f[i][j] > 0 && h[i] == h[j]+1) {
					pushed = true;
					let addf = Math.min(c[i][j]-f[i][j], e[i]);
					f[i][j] += addf,  f[j][i] -= addf;
                    steps.push([edges_dict.get(node_dict.get(i) + ' ' + node_dict.get(j)), f[i][j], -1, -1, -1, h.slice(), addf]);
					e[i] -= addf,  e[j] += addf;
					if (e[i] == 0) {
                        --sz;
                    }
				}
            }
			if (!pushed) {
				h[i] = Infinity;
				for (let j=0; j<n; ++j) {
					if (c[i][j]-f[i][j] > 0 && h[j]+1 < h[i]) {
						h[i] = h[j]+1;
                    }
                }
                steps.push([-1, -1, i, i, -h[i], h.slice(), -1]);
				if (h[i] > h[maxh[0]]) {
					sz = 0;
					break;
				}
			}
		}
	}
    flow = 0;
	for (let i=0; i<n; i++) {
		if (c[0][i]) {
			flow += f[0][i];
        }
    }
	console.log(Math.max(flow, 0));
    console.log(nodes_xy);
}


function unfade(element) {
    var op = 0;  // initial opacity
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += 0.05;
    }, 30);
}

function prev_func() {
    if (step_ind == 0) {
        back_steps.pop(step_ind--);
        s.graph.nodes()[node_to_num.get(so)].color = 'FFFF00';
        console.log(node_to_num.get(so));
        s.graph.nodes()[node_to_num.get(t)].color = 'FFFF00';
        for (let i = 0; i < nodes_arr.length; ++i) {
            s.graph.nodes()[i].x = nodes_xy[i][0];
            s.graph.nodes()[i].y = nodes_xy[i][1];
        }
        s.refresh();
        unfade(document.getElementById("sigma_practice"));
        h_text = document.getElementById("h_arr");
        h_text1 = document.getElementById("h_arr1");
        h_text.innerHTML = 'h = { }';
        h_text1.innerHTML = '';
    }
    else if (step_ind < 0) {
        alert("That was the first step");
    }
    else {
        let arr = back_steps[step_ind];
        let h_text1 = document.getElementById("h_arr1");
        h_text1.innerHTML = back_steps[step_ind - 1][7];
        if (arr[0] != -1) {
            s.graph.edges()[arr[0]].curr = arr[1];
            if (s.graph.edges()[arr[0]].curr == 0) {
                s.graph.edges()[arr[0]].color = '#ADD8E6';
            } else if (s.graph.edges()[arr[0]].curr < s.graph.edges()[arr[0]].capacity) {
                s.graph.edges()[arr[0]].color = '#00F000';
            } else if (s.graph.edges()[arr[0]].curr == s.graph.edges()[arr[0]].capacity) {
                s.graph.edges()[arr[0]].color = '#FF0000';
            }
            if (arr[6] != -1) {
                nodes_flow[node_to_num.get(s.graph.edges()[arr[0]].target)] -= arr[6];
                if (s.graph.edges()[arr[0]].source != so)
                    nodes_flow[node_to_num.get(s.graph.edges()[arr[0]].source)] += arr[6];
                s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].target)].size = 15 + nodes_flow[node_to_num.get(s.graph.edges()[arr[0]].target)] * SCALE;
                s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].source)].size = 15 + nodes_flow[node_to_num.get(s.graph.edges()[arr[0]].source)] * SCALE;
                if (nodes_flow[node_to_num.get(s.graph.edges()[arr[0]].target)] > 0 && s.graph.edges()[arr[0]].target != t) {
                    s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].target)].color = '#EE651D';
                } else if (s.graph.edges()[arr[0]].target != t) {
                    s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].target)].color = '#FFFF00';
                }
                if (nodes_flow[node_to_num.get(s.graph.edges()[arr[0]].source)] > 0 && s.graph.edges()[arr[0]].source != so) {
                    s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].source)].color = '#EE651D';
                } else if (s.graph.edges()[arr[0]].source != so) {
                    s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].source)].color = '#FFFF00';
                }
                console.log(s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].target)].size);
                console.log(nodes_flow);
            }
            s.graph.edges()[arr[0]].label = s.graph.edges()[arr[0]].curr + ' / ' + s.graph.edges()[arr[0]].capacity;
        }
        if (arr[2] != -1) {
            s.graph.nodes()[arr[2]].x = arr[3] * 0.8 ** arr[3] + 0.2 ** arr[3];
            s.graph.nodes()[arr[2]].y = arr[4];
        }
        back_steps.pop(step_ind--);
        h_text = document.getElementById("h_arr");
        h_text.innerHTML = 'h = {' + arr[5].toString() + '}';
        s.refresh();
        unfade(document.getElementById("sigma_practice"));
    }
}

function next_func() {
    if (step_ind >= steps.length - 1) {
        let h_text1 = document.getElementById("h_arr1");
        h_text1.innerHTML = "The end of the algorithm. The answer is " + flow.toString();
        return;
    }
    else {
        s.graph.nodes()[node_to_num.get(so)].color = "#0000FF";
        s.graph.nodes()[node_to_num.get(t)].color = "#0000FF";
        ++step_ind;
        let arr = steps[step_ind];
        let prev_arr = [arr[0], -1, arr[2], -1, -1, arr[5].slice(), arr[6], ""];
        if (step_ind != 0) {
            prev_arr[5] = steps[step_ind - 1][5].slice();
        }
        if (arr[2] != -1) {
            prev_arr[3] = s.graph.nodes()[arr[2]].x;
            prev_arr[4] = s.graph.nodes()[arr[2]].y;
        }
        if (arr[0] != -1) {
            prev_arr[1] = s.graph.edges()[arr[0]].curr;
        }
        if (arr[0] == -1) {
            let h_text1 = document.getElementById("h_arr1");
            h_text1.innerHTML = "We can't push, that is why we need to lift node " + node_dict.get(arr[2]) + " to height " + (-arr[4]).toString();
            prev_arr[7] = h_text1.innerHTML;
        }
        else
        {
            let h_text1 = document.getElementById("h_arr1");
            h_text1.innerHTML = "Currently we can push flow from node " + s.graph.edges()[arr[0]].source + " to node " + s.graph.edges()[arr[0]].target;
            prev_arr[7] = h_text1.innerHTML;
        }
        back_steps.push(prev_arr);
        if (arr[0] != -1) {
            s.graph.edges()[arr[0]].curr = arr[1];
            if (s.graph.edges()[arr[0]].curr == 0) {
                s.graph.edges()[arr[0]].color = '#ADD8E6';
            } else if (s.graph.edges()[arr[0]].curr < s.graph.edges()[arr[0]].capacity) {
                s.graph.edges()[arr[0]].color = '#00F000';
            } else if (s.graph.edges()[arr[0]].curr == s.graph.edges()[arr[0]].capacity) {
                s.graph.edges()[arr[0]].color = '#FF0000';
            }
            if (arr[6] != -1) {
                nodes_flow[node_to_num.get(s.graph.edges()[arr[0]].target)] += arr[6];
                if (s.graph.edges()[arr[0]].source != so)
                    nodes_flow[node_to_num.get(s.graph.edges()[arr[0]].source)] -= arr[6];
                s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].target)].size = 15 + nodes_flow[node_to_num.get(s.graph.edges()[arr[0]].target)] * SCALE;
                if (nodes_flow[node_to_num.get(s.graph.edges()[arr[0]].target)] > 0 && s.graph.edges()[arr[0]].target != t) {
                    s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].target)].color = '#EE651D';
                } else if (s.graph.edges()[arr[0]].target != t) {
                    s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].target)].color = '#FFFF00';
                }
                if (nodes_flow[node_to_num.get(s.graph.edges()[arr[0]].source)] > 0 && s.graph.edges()[arr[0]].source != so) {
                    s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].source)].color = '#EE651D';
                } else if (s.graph.edges()[arr[0]].source != so) {
                    s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].source)].color = '#FFFF00';
                }
                s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].source)].size = 15 + nodes_flow[node_to_num.get(s.graph.edges()[arr[0]].source)] * SCALE;
                console.log(s.graph.nodes()[node_to_num.get(s.graph.edges()[arr[0]].target)].size);
                console.log(nodes_flow);
            }
            s.graph.edges()[arr[0]].label = s.graph.edges()[arr[0]].curr + ' / ' + s.graph.edges()[arr[0]].capacity;
        }
        if (arr[2] != -1) {
            s.graph.nodes()[arr[2]].x = arr[3] * 0.8 ** arr[3] + 0.2 ** arr[3];
            s.graph.nodes()[arr[2]].y = arr[4];
        }
        if (arr[2] == 0) {
            for (let i = 1; i < nodes_arr.length; ++i) {
                s.graph.nodes()[i].y = -(1 / (i + 1));
                s.graph.nodes()[i].x = i;
            }
        }
        let h_text = document.getElementById("h_arr");
        h_text.innerHTML = 'h = {' + arr[5].toString() + '}';
        s.refresh();
        unfade(document.getElementById("sigma_practice"));
    }
}

var node_add = document.getElementById("node_add");
node_add.onclick = add_node;

var example = document.getElementById("example_graph");
example.onclick = example_graph;

var edge_add = document.getElementById("edge_add");
edge_add.onclick = add_edge;

var clear_graph = document.getElementById("clear_graph");
clear_graph.onclick = clear_all;

var run = document.getElementById("run");
run.onclick = push_relabel;

var next = document.getElementById("next");
next.onclick = next_func;

var prev = document.getElementById("prev");
prev.onclick = prev_func;