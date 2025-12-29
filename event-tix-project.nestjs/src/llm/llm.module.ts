import { Module, forwardRef } from '@nestjs/common';
// import {LlmService} from './llm.service';
import {LlmRagService} from './llm.service'
import { EventModule } from '../Event/event.module';
import{VectorDBService} from './vector-db.service'

@Module({
  imports: [
    forwardRef(() => EventModule), // ✅ حل الاعتماد الدائري
  ],
//   LlmService
  providers: [LlmRagService,VectorDBService ],
  exports: [LlmRagService,VectorDBService ],
})
export class LlmModule {}
