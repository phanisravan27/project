import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

// Blocking queue example for producer and consumer 
/* Phani Sravan Kolapalli */

public class BlockingQ {
  public static void main(String[] args) {
    BlockingQueue<Character> blockingqueue = new ArrayBlockingQueue<Character>(26);
    
    ExecutorService executor = Executors.newFixedThreadPool(2);
    Runnable producer;
    producer = new Runnable() {
      public void run() {
        for (char c = 'X'; c <= 'Z'; c++) {
          try {
            blockingqueue.put(c);
            System.out.println("we are putting in queue:"+c);
          } catch (InterruptedException ie) {
            assert false;
          }
        }
      }
    };
    executor.execute(producer);
    Runnable consumer;
    consumer = new Runnable() {
    	
      public void run() {
        char c = '\0';
        do {
          try {
            c = blockingqueue.take();
            System.out.println("we are getting from queue:"+c);
          } catch (InterruptedException ie) {
          }
        } while (c != 'Z');
        executor.shutdownNow();
      }
    };
    executor.execute(consumer);
  }
}