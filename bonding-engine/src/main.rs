use std::net::UdpSocket;
use std::thread;
use std::time::Duration;

fn main() {
    // Simulate three network interfaces (Starlink, 5G, Fiber)
    let interfaces = vec![
        ("Starlink", "127.0.0.1:9001", "127.0.0.1:10001"),
        ("5G", "127.0.0.1:9002", "127.0.0.1:10002"),
        ("Fiber", "127.0.0.1:9003", "127.0.0.1:10003"),
    ];

    let mut handles = vec![];

    // Receiver threads for each interface
    for (name, bind_addr, _send_addr) in interfaces.clone() {
        let handle = thread::spawn(move || {
            let socket = UdpSocket::bind(bind_addr).expect("Failed to bind interface");
            println!("Interface {} listening on {}", name, bind_addr);
            let mut buf = [0; 1024];
            loop {
                match socket.recv_from(&mut buf) {
                    Ok((size, src)) => {
                        println!("{} received {} bytes from {}", name, size, src);
                    }
                    Err(e) => {
                        eprintln!("{} error: {}", name, e);
                    }
                }
            }
        });
        handles.push(handle);
    }

    // Sender thread: round-robin send packets to target servers
    let sender_handle = thread::spawn(move || {
        let mut counter = 0;
        loop {
            // Choose interface in round-robin
            let (_name, _bind_addr, send_addr) = &interfaces[counter % interfaces.len()];
            let socket = UdpSocket::bind("0.0.0.0:0").expect("Failed to bind sender socket");
            let msg = format!("Bonded packet #{}", counter);
            socket.send_to(msg.as_bytes(), send_addr).expect("Failed to send");
            counter += 1;
            thread::sleep(Duration::from_millis(500));
        }
    });
    handles.push(sender_handle);

    for handle in handles {
        handle.join().unwrap();
    }
}
